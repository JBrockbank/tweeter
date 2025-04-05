import { StatusDto, UserDto } from "tweeter-shared";
import { FeedDAO } from "../interfaces/FeedDAO";
import { DynamoDAO } from "./DynamoDAO";
import { QueryCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

export class FeedDAODynamo extends DynamoDAO implements FeedDAO {
  protected readonly tableName: string = "Feed";

  public async createFollowersFeed(
    user: UserDto,
    userFollowers: string[],
    status: StatusDto
  ): Promise<void> {
    const feedItems = userFollowers.map((follower) => ({
      alias: follower,
      timestamp: status.timestamp,
      user: user,
      post: status.post,
    }));

    const request = feedItems.map((item) => ({
      PutRequest: {
        Item: item,
      },
    }));

    const params = {
      RequestItems: {
        [this.tableName]: request,
      },
    };

    try {
      await this.client.send(new BatchWriteCommand(params));
      //console.log("Feed pulled successfully");
    } catch (error) {
      //console.error("Error in pullFeed:", error);
      throw new Error((error as Error).message);
    }
  }

  async getFeedForUser(
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null = null
  ): Promise<[StatusDto[], boolean]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: "alias = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey: lastItem
        ? {
            alias,
            timestamp: lastItem?.timestamp,
          }
        : undefined,
    };

    // Validate ExclusiveStartKey
    if (lastItem && (!lastItem.user?.alias || !lastItem.timestamp)) {
      throw new Error("Invalid pagination key: Missing alias or timestamp");
    }

    try {
      const result = await this.client.send(new QueryCommand(params));
      const feed = (result.Items || []).map((item) => ({
        alias: item.alias,
        user: item.user,
        post: item.post,
        timestamp: item.timestamp,
      }));

      const hasMore = !!result.LastEvaluatedKey;
      return [feed, hasMore];
    } catch (error) {
      console.error(`Error retrieving feed for user ${alias}`, error);
      throw new Error(
        `Error retrieving feed for user ${alias}: lastItem: ${
          lastItem?.alias
        } : Error: ${(error as Error).message}`
      );
    }
  }
}
