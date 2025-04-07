import { AuthToken, UserDto, AuthTokenDto } from "tweeter-shared";
import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDAO } from "./DynamoDAO";

export class AuthTokenDAODynamo extends DynamoDAO implements AuthTokenDAO {
  protected tableName = "AuthToken"; // Set the table name for DynamoDAO
  private readonly expirationTime = 60 * 60 * 1000; // 1 hour expiration

  async createSession(authToken: AuthToken, user: UserDto): Promise<void> {
    const item = {
      token: authToken.token,
      alias: user.alias,
      timestamp: authToken.timestamp,
    };

    try {
      await this.putItem(item);
      // console.log(`Session created successfully for user: ${user.alias}`);
    } catch (error) {
      throw new Error(
        `Error adding session: ${this.tableName} - ${item.alias}, ${item.token}, ${item.timestamp}`
      );
    }
  }

  async getAliasFromToken(token: string): Promise<string> {
    try {
      const item = await this.getItem({ token });
  
      if (!item) {
        throw new Error("No session found for token");
      }
  
      const tokenTimestamp = Number(item.timestamp);
      const currentTime = Date.now();
      const isExpired = currentTime - tokenTimestamp > this.expirationTime;
  
      if (isExpired) {
        await this.endSession(item);
        throw new Error("Token has expired");
      }
  
      return item.alias;
    } catch (error) {
      throw new Error("Error getting alias from token");
    
    }
  }
  

  public async verifySession(authToken: AuthTokenDto): Promise<boolean> {
    try {
      const item = await this.getItem({ token: authToken.token });
  
      if (!item) {
        return false;
      }
  
      const tokenTimestamp = Number(item.timestamp);
      const currentTime = Date.now();
      const isExpired = currentTime - tokenTimestamp > this.expirationTime;
      if (isExpired) {
        await this.endSession(item);
        throw new Error("Token has expired");
      }
      
  
      return !isExpired;
    } catch (error) {
      throw new Error("Error verifying session");
    }
  }
  

  public async endSession(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        token,
      },
    };

    try {
      await this.client.send(new DeleteCommand(params));
      console.log(`AuthToken ${token} deleted successfully.`);
    } catch (error) {
      throw new Error(`Failed to delete AuthToken: ${token}`);
    }
  }
}
