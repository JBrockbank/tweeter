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
  
}
