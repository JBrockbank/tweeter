import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {

  private serverFacade = new ServerFacade();


  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return await this.serverFacade.getMoreFollowers(authToken.token, userAlias, pageSize, lastItem);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    console.log("ClientSide FollowService loadMoreFollowees - lastItem: " + lastItem?.alias);
    console.log("PageSize: " + pageSize);
    return await this.serverFacade.getMoreFollowees(authToken.token, userAlias, pageSize, lastItem);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return await this.serverFacade.getIsFollowerStatus(authToken.token, user, selectedUser);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return await this.serverFacade.getFolloweeCount(authToken.token, user.dto);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return await this.serverFacade.getFollowerCount(authToken.token, user.dto);

  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    return await this.serverFacade.follow(authToken.token, userToFollow.dto)
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    return await this.serverFacade.unfollow(authToken.token, userToUnfollow.dto)
  }
}
