import { UserDto } from "tweeter-shared";

export interface FollowDAO {
  getFollowers(userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<{ followers: string[]; hasMore: boolean; }>;
  getFollowees(userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<{ followees: string[]; hasMore: boolean; }>;
  getIsFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
  getFollowerCount(alias: string): Promise<number>;
  getFolloweeCount(alias: string): Promise<number>;
  getFollowerAlias(alias: string): Promise<string[]>;
  follow(currentUserAlias: string, userToFollow: string): Promise<void>;
  unfollow(currentUserAlias: string, userToUnfollow: string): Promise<void>;

}
