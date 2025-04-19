import { StatusDto, UserDto } from "tweeter-shared";
import { FeedDAO } from "../interfaces/FeedDAO";
import { DynamoDAO } from "./DynamoDAO";
import { QueryCommand, BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput } from "@aws-sdk/lib-dynamodb";

export class FeedDAODynamo extends DynamoDAO implements FeedDAO {
  protected readonly tableName: string = "Feed";
  readonly aliasAttr = "alias";
  readonly timestampAttr = "timestamp";
  readonly userAttr = "user";
  readonly postAttr = "post";

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


  async batchPostFeed(userHandles: string[], status: StatusDto): Promise<void> {
    const params = {
      RequestItems: {
        [this.tableName]: this.createPutFeedRequestItems(userHandles, status),
      },
    };
    try {
      console.log(params);
      const resp = await this.client.send(new BatchWriteCommand(params));
      // console.log(resp);
      await this.putUnprocessedItems(resp, params);
    } catch (err) {
      throw new Error(
        `Error while batch writing feeds with params: ${params}: \n${err}`
      );
    }
  }

  private createPutFeedRequestItems(userHandles: string[], status: StatusDto) {
    return userHandles.map((userHandle) =>
      this.createPutFeedRequest(userHandle, status)
    );
  }

  private createPutFeedRequest(userHandle: string, status: StatusDto) {
    const item = {
      [this.aliasAttr]: userHandle,
      [this.timestampAttr]: status.timestamp,
      [this.postAttr]: status.post,
      [this.userAttr]: status.user
    };

    return {
      PutRequest: {
        Item: item,
      },
    };
  }
  private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput
  ) {
    let delay = 10;
    let attempts = 0;

    while (
      resp.UnprocessedItems !== undefined &&
      Object.keys(resp.UnprocessedItems).length > 0
    ) {
      attempts++;

      if (attempts > 1) {
        // Pause before the next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Increase pause time for next attempt
        if (delay < 1000) {
          delay += 100;
        }
      }

      console.log(
        `Attempt ${attempts}. Processing ${
          Object.keys(resp.UnprocessedItems).length
        } unprocessed feed items.`
      );

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }
}
