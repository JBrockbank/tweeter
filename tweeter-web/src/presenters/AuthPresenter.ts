import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";
 
export interface AuthView extends View {
  updateUserInfo: (
    user: User,
    profile: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  navigate: (path: string) => void;
}

export abstract class AuthPresenter<T extends AuthView> extends Presenter<T> {
  private _userService: UserService;
  public isLoading = false;

  protected constructor(view: T) {
    super(view);
    this._userService = new UserService();
    this.isLoading = false;
  }

  protected get userService(): UserService {
    return this._userService;
  }

  protected authOperation(
    operation: () => Promise<[User, AuthToken]>,
    description: string,
    rememberMe: boolean,
    originalUrl?: string
  ): void {
    this.doFailureRecordingOperation(
      async () => {
        this.isLoading = true;

        const [user, authToken] = await operation();

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        if (originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate("/");
        }
      },
      description,
      () => {
        this.isLoading = false;
      }
    );
  }
}
