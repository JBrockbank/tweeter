import { AuthToken, FakeData, Status, StatusDto } from "tweeter-shared";
import { FactoryDAO } from "../../database/dao/factory/FactoryDAO";
import { FeedDAO } from "../../database/dao/interfaces/FeedDAO";
import { StatusDAO } from "../../database/dao/interfaces/StatusDAO";
import { AuthTokenDAO } from "../../database/dao/interfaces/AuthTokenDAO";
import { FollowDAO } from "../../database/dao/interfaces/FollowDAO";
import { UserDAO } from "../../database/dao/interfaces/UserDAO";

export class StatusService {
  private factoryDAO: FactoryDAO;
  private statusDAO: StatusDAO;
  private feedDAO: FeedDAO;
  private authTokenDAO: AuthTokenDAO;
  private followDAO: FollowDAO;
  private userDAO: UserDAO;

  constructor(factoryDAO: FactoryDAO) {
      this.factoryDAO = factoryDAO;
      this.statusDAO = this.factoryDAO.getStatusDAO();
      this.feedDAO = this.factoryDAO.getFeedDAO();
      this.authTokenDAO = this.factoryDAO.getAuthTokenDAO();
      this.followDAO = this.factoryDAO.getFollowDAO();
      this.userDAO = this.factoryDAO.getUserDAO();
    }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return await this.feedDAO.getFeedForUser(userAlias, pageSize, lastItem)
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return await this.statusDAO.getPageOfStatuses(userAlias, pageSize, lastItem);
  }


  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    const status = Status.fromDto(newStatus);
    const loggedInUserAlias = await this.authTokenDAO.getAliasFromToken(token);
    if(!loggedInUserAlias){
      throw new Error("Logged in User does not match User Posting Status");
    }

    if(!status){
      throw new Error("Status returned null");
    }

    try {
      await this.statusDAO.createStatus(status);
      const followers = await this.followDAO.getFollowerAlias(loggedInUserAlias);
      if (followers.length > 0) {
        const user = await this.userDAO.getUser(loggedInUserAlias);
        if(!user){
          throw new Error("Error getting User from Alias");
        }
        await this.feedDAO.createFollowersFeed(user, followers, newStatus);
      }
    }
    catch (error) {
      throw new Error((error as Error).message)
    }
  };

}
