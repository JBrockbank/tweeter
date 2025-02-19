import { User } from "tweeter-shared";
import { ItemPresenter, ItemView } from "./ItemPresenter";
import { FollowService } from "../model/service/FollowService";



export abstract class UserItemPresenter extends ItemPresenter<User, ItemView<User>, FollowService>{

  public constructor(view: ItemView<User>) {
    super(view);
  }

  protected createService(): FollowService {
    return new FollowService();
  }
}
