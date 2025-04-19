import { UserDto } from "tweeter-shared";
import { FollowDAO } from "../interfaces/FollowDAO";
import { DynamoDAO } from "./DynamoDAO";
import {
  QueryCommand,
  DeleteCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

export class FollowDAODynamo extends DynamoDAO implements FollowDAO {
  protected readonly tableName = "Followers";

  async getFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<{ followers: string[]; hasMore: boolean }> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: "followeeAlias = :userAlias",
      ExpressionAttributeValues: {
        ":userAlias": userAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem
        ? { followeeAlias: userAlias, followerAlias: lastItem.alias }
        : undefined,
    };

    try {
      const result = await this.client.send(new QueryCommand(params));
      const followers = (result.Items || []).map((item) => item.followerAlias);

      return {
        followers,
        hasMore: !!result.LastEvaluatedKey,
      };
    } catch (error) {
      console.error(`Error getting followers for ${userAlias}`, error);
      throw new Error("Error retrieving followers");
    }
  }

  async getFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<{ followees: string[]; hasMore: boolean }> {
    const params = {
      TableName: this.tableName,
      IndexName: "FollowerIndex",
      KeyConditionExpression: "followerAlias = :userAlias",
      ExpressionAttributeValues: {
        ":userAlias": userAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem
        ? { followerAlias: userAlias, followeeAlias: lastItem.alias }
        : undefined,
    };

    try {
      const result = await this.client.send(new QueryCommand(params));
      const followees = (result.Items || []).map((item) => item.followeeAlias);

      return {
        followees: followees,
        hasMore: !!result.LastEvaluatedKey,
      };
    } catch (error) {
      console.error(`Error getting followees for ${userAlias}`, error);
      throw new Error("Error retrieving followees");
    }
  }

  async getIsFollower(
    followerAlias: string,
    followeeAlias: string
  ): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression:
        "followerAlias = :followerAlias AND followeeAlias = :followeeAlias",
      ExpressionAttributeValues: {
        ":followeeAlias": followeeAlias,
        ":followerAlias": followerAlias,
      },
      Limit: 1,
    };
    try {
      const response = await this.client.send(new QueryCommand(params));
      return !!(response.Items && response.Items.length > 0);
    } catch (error) {
      throw new Error("Error getting isFollower status");
    }
  }

  async getFollowerCount(alias: string): Promise<number> {
    const params: QueryCommandInput = {
      TableName: this.tableName, // Query the base table
      KeyConditionExpression: "followeeAlias = :followeeAlias",
      ExpressionAttributeValues: {
        ":followeeAlias": alias,
      },
      Select: "COUNT", // Only count items
      ConsistentRead: false,
    };

    try {
      const result = await this.client.send(new QueryCommand(params));
      return result.Count || 0; // Return count or default to 0 if undefined
    } catch (error) {
      console.error(`Error getting follower count for ${alias}:`, error);
      throw new Error("Error retrieving follower count");
    }
  }

  async getFolloweeCount(alias: string): Promise<number> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: "FollowerIndex",
      KeyConditionExpression: "followerAlias = :followerAlias",
      ExpressionAttributeValues: {
        ":followerAlias": alias,
      },
      Select: "COUNT",
      ConsistentRead: false,
    };

    try {
      const result = await this.client.send(new QueryCommand(params));
      return result.Count || 0;
    } catch (error) {
      console.error(`Error getting followee count for ${alias}`, error);
      throw new Error("Error retrieving followee count");
    }
  }

  async follow(
    currentUserAlias: string,
    userToFollowAlias: string
  ): Promise<void> {
    const item = {
      followerAlias: currentUserAlias,
      followeeAlias: userToFollowAlias,
    };

    try {
      await this.putItem(item);
    } catch (error) {
      console.error(
        `Error following ${userToFollowAlias} by ${currentUserAlias}`,
        error
      );
      throw new Error((error as Error).message);
    }
  }

  async unfollow(
    currentUserAlias: string,
    userToUnfollowAlias: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        followerAlias: currentUserAlias,
        followeeAlias: userToUnfollowAlias,
      },
    };

    try {
      await this.client.send(new DeleteCommand(params));
    } catch (error) {
      console.error(
        `Error unfollowing ${userToUnfollowAlias} by ${currentUserAlias}`,
        error
      );
      throw new Error("Error deleting follow relationship");
    }
  }

  async getFollowerAlias(userAlias: string): Promise<string[]> {
    try {
      const params: QueryCommandInput = {
        TableName: this.tableName,
        KeyConditionExpression: "followeeAlias = :followeeAlias",
        ExpressionAttributeValues: {
          ":followeeAlias": userAlias,
        },
        ProjectionExpression: "followerAlias",
      };

      const followerAliases: string[] = [];
      let lastEvaluatedKey: Record<string, any> | undefined;

      do {
        if (lastEvaluatedKey) {
          params.ExclusiveStartKey = lastEvaluatedKey;
        }

        const response = await this.client.send(new QueryCommand(params));

        if (response.Items) {
          // Extract follower aliases from the response
          followerAliases.push(
            ...response.Items.map((item) => item.followerAlias)
          );
        }

        lastEvaluatedKey = response.LastEvaluatedKey;
      } while (lastEvaluatedKey);

      return followerAliases;
    } catch (error) {
      console.error(
        `Error retrieving follower aliases for ${userAlias}`,
        error
      );
      throw new Error("Failed to retrieve follower aliases");
    }
  }
}
