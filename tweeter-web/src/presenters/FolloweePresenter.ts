import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./ItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[User[], boolean]> {
    console.log("FolloweePresenter GetMoreItems: lastItem = " + this.lastItem?.alias);
    return this.service.loadMoreFollowees(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }

  protected getItemDescription(): string {
    return "load followees";
  }
}
