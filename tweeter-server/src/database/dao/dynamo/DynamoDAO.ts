import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";


export abstract class DynamoDAO {
    protected readonly client = DynamoDBDocumentClient.from(new DynamoDBClient("us-east-1"));
    protected tableName: string | undefined;

      protected async getItem(key: Record<string, any>): Promise<any> {
        const params = {
          TableName: this.tableName,
          Key: key,
        };
      
        try {
          const result = await this.client.send(new GetCommand(params));
          return result.Item || null;
        } catch (error) {
          console.error(`Error getting item with key: ${JSON.stringify(key)}`, error);
          throw new Error("Error retrieving item");
        }
      }
      
      protected async putItem(item: Record<string, any>): Promise<void> {
        const params = {
          TableName: this.tableName,
          Item: item,
        };
      
        try {
          await this.client.send(new PutCommand(params));
        } catch (error) {
          console.error(`Error putting item: ${JSON.stringify(item)}`, error);
          throw new Error("Error saving item");
        }
      }
      
}