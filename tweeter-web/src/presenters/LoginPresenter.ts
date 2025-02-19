import { AuthToken, User } from "tweeter-shared";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginView extends AuthView {}

export class LoginPresenter extends AuthPresenter<LoginView> {
  public constructor(view: LoginView) {
    super(view);
  }

  public async doLogin(
    alias: string,
    password: string,
    originalUrl: string | undefined,
    rememberMe: boolean
  ): Promise<void> {
    this.authOperation(
      () => this.userService.login(alias, password),
      "log user in",
      rememberMe,
      originalUrl
    );
  }

  // public async doLogin(alias: string, password: string, originalUrl: string | undefined, rememberMe: boolean): Promise<void> {
  //   this.doFailureRecordingOperation(async () => {
  //     this.isLoading = true;

  //       const [user, authToken] = await this.userService.login(alias, password);

  //       this.view.updateUserInfo(user, user, authToken, rememberMe);

  //       if (!!originalUrl) {
  //         this.view.navigate(originalUrl);
  //       } else {
  //         this.view.navigate("/");
  //       }
  //   }, "log user in", () => {
  //     this.isLoading = false;});
  // }
}
