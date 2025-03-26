import { AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {

  private serverFacade = new ServerFacade();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return await this.serverFacade.getMoreFeedItems(authToken.token, userAlias, pageSize, lastItem);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return await this.serverFacade.getMoreStoryItems(authToken.token, userAlias, pageSize, lastItem);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    return await this.serverFacade.postStatus(authToken.token, newStatus.dto);
  };

}
