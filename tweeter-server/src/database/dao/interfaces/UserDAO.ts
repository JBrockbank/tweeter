import { User, UserDto } from "tweeter-shared";

export interface UserDAO {
  getUser(alias: string): Promise<UserDto | null>;
  createUser(user: User, password: string): Promise<void>;
  getHashedPassword(alias: string): Promise<string>;
  getFolloweeCount(alias: string): Promise<number>;
  getFollowerCount(alias: string): Promise<number>;
  updateFolloweeCount(alias:string, count: number): Promise<void>;
  updateFollowerCount(alias:string, count: number): Promise<void>;

}