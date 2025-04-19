import { AuthToken, User, UserDto } from "tweeter-shared";
import { FollowDAO } from "../../database/dao/interfaces/FollowDAO";
import { FactoryDAO } from "../../database/dao/factory/FactoryDAO";
import { AuthTokenDAO } from "../../database/dao/interfaces/AuthTokenDAO";
import { UserDAO } from "../../database/dao/interfaces/UserDAO";

export class FollowService {
  private factoryDAO: FactoryDAO;
  private followDAO: FollowDAO;
  private authTokenDAO: AuthTokenDAO;
  private userDAO: UserDAO;

  constructor(factoryDAO: FactoryDAO) {
    this.factoryDAO = factoryDAO;
    this.followDAO = factoryDAO.getFollowDAO();
    this.authTokenDAO = factoryDAO.getAuthTokenDAO();
    this.userDAO = factoryDAO.getUserDAO();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const currentUserAlias = await this.authTokenDAO.getAliasFromToken(token);
  
    if (!currentUserAlias) {
      throw new Error("Unauthorized access - Bad AuthToken");
    }
  
    const { followers, hasMore } = await this.followDAO.getFollowers(
      userAlias,
      pageSize,
      lastItem
    );
  
    // Fetch full UserDto for each alias
    const userDtos = await Promise.all(
      followers.map(async (follower) => {
        try {
          return await this.userDAO.getUser(follower); // Ensure it returns UserDto
        } catch (error) {
          console.error(`Failed to fetch user for alias ${follower}`, error);
          return null;
        }
      })
    );
  
    // Filter out null values and ensure type safety
    const filteredUserDtos: UserDto[] = userDtos.filter(
      (user): user is UserDto => user !== null
    );
  
    return [filteredUserDtos, hasMore];
  }
  
  

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const currentUserAlias = await this.authTokenDAO.getAliasFromToken(token);
  
    if (!currentUserAlias) {
      throw new Error("Unauthorized access - Bad AuthToken");
    }
  
    // Get followee aliases from followDAO
    const { followees, hasMore } = await this.followDAO.getFollowees(
      userAlias,
      pageSize,
      lastItem
    );
  
    // Fetch full UserDto for each alias
    const userDtos = await Promise.all(
      followees.map(async (followee) => {
        try {
          return await this.userDAO.getUser(followee); // Ensure it returns UserDto
        } catch (error) {
          console.error(`Failed to fetch user for alias ${followee}`, error);
          return null; // Return null on failure
        }
      })
    );
  
    // Filter out null values and ensure type safety
    const filteredUserDtos: UserDto[] = userDtos.filter(
      (user): user is UserDto => user !== null
    );
  
    return [filteredUserDtos, hasMore];
  }
  
  

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    const currentUserAlias = await this.authTokenDAO.getAliasFromToken(token);

    if (!currentUserAlias) {
      throw new Error("Unauthorized access - Bad AuthToken");
    }

    return this.followDAO.getIsFollower(user.alias, selectedUser.alias);
  }

  public async getFolloweeCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    const currentUserAlias = user.alias;

    if (!currentUserAlias) {
      throw new Error("Unauthorized access - Bad AuthToken");
    }
    return this.userDAO.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    const currentUserAlias = user.alias;

    if (!currentUserAlias) {
      throw new Error("Unauthorized access - Bad AuthToken");
    }

    return this.userDAO.getFollowerCount(user.alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[number, number]> {
    const currentUserAlias = await this.authTokenDAO.getAliasFromToken(token);
    
    if (!currentUserAlias) {
      throw new Error("Unable to get User from AuthToken");
    }
  
    await this.followDAO.follow(currentUserAlias, userToFollow.alias);
  
    let followerCount = await this.followDAO.getFollowerCount(userToFollow.alias);
  
    let followeeCount = await this.followDAO.getFolloweeCount(userToFollow.alias);
  
    await this.userDAO.updateFollowerCount(userToFollow.alias, followerCount);
  
    await this.userDAO.updateFolloweeCount(currentUserAlias, followeeCount);

    followerCount = await this.userDAO.getFollowerCount(userToFollow.alias);
    followeeCount = await this.userDAO.getFolloweeCount(userToFollow.alias);


  
    return [followerCount, followeeCount];
  }
  

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[number, number]> {
    const currentUserAlias = await this.authTokenDAO.getAliasFromToken(token);
  
    if (!currentUserAlias) {
      throw new Error("Unable to get User from AuthToken");
    }
  
    await this.followDAO.unfollow(currentUserAlias, userToUnfollow.alias);
  
    let followerCount = await this.followDAO.getFollowerCount(userToUnfollow.alias);
  
    let followeeCount = await this.followDAO.getFolloweeCount(currentUserAlias);
  
    await this.userDAO.updateFollowerCount(userToUnfollow.alias, followerCount);
  
    await this.userDAO.updateFolloweeCount(currentUserAlias, followeeCount);

    followerCount = await this.userDAO.getFollowerCount(userToUnfollow.alias);
    followeeCount = await this.userDAO.getFolloweeCount(userToUnfollow.alias);
  
    return [followerCount, followeeCount];
  }

  public async getFollowersForFeedUpdate(
    userAlias: string,
    pageSize: number,
    lastItem: string | null
  ): Promise<[string[], boolean]> {
    let lastItemUser = null;
    if (lastItem){
      lastItemUser = await this.userDAO.getUser(lastItem);
    }
    const { followers, hasMore } = await this.followDAO.getFollowers(
      userAlias,
      pageSize,
      lastItemUser
    );
  
    return [followers, hasMore];
  }
  

}
