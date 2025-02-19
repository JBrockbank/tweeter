import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface NavBarView extends View{
  displayInfoMessage(message: string, duration: number): void;
  clearLastInfoMessage(): void;
  clearUserInfo(): void;
}

export class NavBarPresenter extends Presenter<NavBarView> {
  private userService: UserService;

  public constructor(view: NavBarView) {
    super(view);
    this.userService = new UserService();
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailureRecordingOperation( async () => {
      await this.userService.logout(authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }
}
