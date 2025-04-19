import { UserDto, User } from "tweeter-shared";
import { UserDAO } from "../interfaces/UserDAO";
import { DynamoDAO } from "./DynamoDAO";

export class UserDAODynamo extends DynamoDAO implements UserDAO {
  protected readonly tableName = "Users";

  
  public async getUser(alias: string): Promise<UserDto | null> {
    const item = await this.getItem({ alias });
    if (!item) {
      return null;
    }
    return new User(
      item.firstName,
      item.lastName,
      item.alias,
      item.imageUrl
    ).dto;
  }

  public async createUser(user: User, hashedPassword: string): Promise<void> {
    const userItem = {
      alias: user.alias,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      hashedPassword: hashedPassword,
      followeeCount: 0,
      followerCount: 0
    };

    await this.putItem(userItem);
  }

  public async getHashedPassword(alias: string): Promise<string> {
    const item = await this.getItem({ alias });
    if (!item || !item.hashedPassword) {
      throw new Error("Hashed password not found");
    }
    return item.hashedPassword;
  }

  public async getFolloweeCount(alias: string): Promise<number> {
    const item = await this.getItem({alias});
    if(!item){
      throw new Error("User not found");
    }
    const count = item.followeeCount;
    return count;
  }

  public async getFollowerCount(alias: string): Promise<number> {
    const item = await this.getItem({alias});
    if(!item){
      throw new Error("User not found");
    }
    const count = item.followerCount;
    return count;
  }

  public async updateFolloweeCount(alias: string, count: number): Promise<void> {
    const user = await this.getItem({alias});
    if(!user){
      throw new Error("User not found");
    }
    const userItem = {
      alias: user.alias,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      hashedPassword: user.hashedPassword,
      followeeCount: count,
      followerCount: user.followerCount
    };

    try {
      await this.putItem(userItem);
    } catch (error) {
      throw new Error(`Error updating follower count for user ${alias}: ${(error as Error).message}`);
    }
    

  }

  public async updateFollowerCount(alias: string, count: number): Promise<void> {
    const user = await this.getItem({ alias });
    
    if (!user) {
      throw new Error("User not found");
    }
  
    const userItem = {
      alias: user.alias,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      hashedPassword: user.hashedPassword,
      followeeCount: user.followeeCount,
      followerCount: count, 
    };
  
    try {
      await this.putItem(userItem);
    } catch (error) {
      throw new Error(`Error updating follower count for user ${alias}: ${(error as Error).message}`);
    }
  }
  


}
