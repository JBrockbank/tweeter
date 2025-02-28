import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter, View } from "./Presenter";

export interface NavBarView extends MessageView {
  clearUserInfo(): void;
}

export class NavBarPresenter extends Presenter<NavBarView> {
  private _userService: UserService;

  public constructor(view: NavBarView) {
    super(view);
    this._userService = new UserService();
  }

  public get userService() {
    return this._userService;
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailureRecordingOperation(async () => {
      await this.userService.logout(authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }
}
