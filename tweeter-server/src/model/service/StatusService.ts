import { AuthToken, FakeData, Status, StatusDto } from "tweeter-shared";
import { FactoryDAO } from "../../database/dao/factory/FactoryDAO";
import { FeedDAO } from "../../database/dao/interfaces/FeedDAO";
import { StatusDAO } from "../../database/dao/interfaces/StatusDAO";
import { AuthTokenDAO } from "../../database/dao/interfaces/AuthTokenDAO";
import { FollowDAO } from "../../database/dao/interfaces/FollowDAO";
import { UserDAO } from "../../database/dao/interfaces/UserDAO";
import { SqsDAO } from "../../database/dao/interfaces/SQSDAO";

export class StatusService {
  private factoryDAO: FactoryDAO;
  private statusDAO: StatusDAO;
  private feedDAO: FeedDAO;
  private authTokenDAO: AuthTokenDAO;
  private followDAO: FollowDAO;
  private userDAO: UserDAO;
  private sqsDao: SqsDAO;

  constructor(factoryDAO: FactoryDAO) {
    this.factoryDAO = factoryDAO;
    this.statusDAO = this.factoryDAO.getStatusDAO();
    this.feedDAO = this.factoryDAO.getFeedDAO();
    this.authTokenDAO = this.factoryDAO.getAuthTokenDAO();
    this.followDAO = this.factoryDAO.getFollowDAO();
    this.userDAO = this.factoryDAO.getUserDAO();
    this.sqsDao = this.factoryDAO.getSqsDAO();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return await this.feedDAO.getFeedForUser(userAlias, pageSize, lastItem);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return await this.statusDAO.getPageOfStatuses(
      userAlias,
      pageSize,
      lastItem
    );
  }

  public async sqsPostStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    try {
      await this.sqsDao.postStatus(newStatus);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    const status = Status.fromDto(newStatus);
    const loggedInUserAlias = await this.authTokenDAO.getAliasFromToken(token);
    if (!loggedInUserAlias) {
      throw new Error("Logged in User does not match User Posting Status");
    }

    if (!status) {
      throw new Error("Status returned null");
    }

    try {
      await this.statusDAO.createStatus(status);
      await this.sqsDao.postStatus(newStatus);

    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public async postToFeed(followers: string[], status: StatusDto) {
    const user = status.user;
    await this.feedDAO.createFollowersFeed(user, followers, status);
  }

  public async sqsPostToFeed(status: StatusDto): Promise<void> {
    let followers: string[] = [];
    let hasMore = true;
    while (hasMore) {
      followers = await this.followDAO.getFollowerAlias(status.user.alias);
      await this.sqsDao.postToFeed(status, followers);
    }
  }

  public async batchPostStatus(
    status: StatusDto,
    followers: string[]
  ): Promise<void> {
    console.log(followers, status);
    //Split into chunks of 25 and batch write them
    const chunkSize = 25;
    for (let i = 0; i < followers.length; i += chunkSize) {
      const chunkedFollowers: string[] = followers.slice(
        i,
        i + chunkSize
      );
      console.log(chunkedFollowers, status);
      await this.feedDAO.batchPostFeed(chunkedFollowers, status);
    }
  }
}
