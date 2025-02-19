import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter<AuthView> {
  public constructor(view: AuthView) {
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
}
