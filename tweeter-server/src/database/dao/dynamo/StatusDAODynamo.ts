import { Status, StatusDto } from "tweeter-shared";
import { StatusDAO } from "../interfaces/StatusDAO";
import { DynamoDAO } from "./DynamoDAO";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class StatusDAODynamo extends DynamoDAO implements StatusDAO {
  protected readonly tableName = "Status";

  async createStatus(status: Status): Promise<void> {
    const userDto = status.user.dto;
    const item = {
      alias: userDto.alias,
      timestamp: status.timestamp,
      post: status.post,
      user: userDto
    };

    try {
      await this.putItem(item);
    } catch (error) {
      console.error(`Error creating status for ${status.user.alias}:`, error);
      throw new Error("Error creating status");
    }
  }

  async getPageOfStatuses(
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
        ? { alias: lastItem.user.alias, timestamp: lastItem.timestamp }
        : undefined,
    };

    try {
      const result = await this.client.send(new QueryCommand(params));
      const statuses = (result.Items || []).map((item) => ({
        alias: item.alias,
        user: item.user,
        post: item.post,
        timestamp: item.timestamp,
      }));

      const hasMore = !!result.LastEvaluatedKey;
      return [statuses, hasMore];
    } catch (error) {
      console.error(`Error retrieving statuses for ${alias}:`, error);
      throw new Error("Error retrieving statuses");
    }
  }
}
