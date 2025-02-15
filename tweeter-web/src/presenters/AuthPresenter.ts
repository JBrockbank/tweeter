import { User, AuthToken } from "tweeter-shared";

export interface AuthView {
  updateUserInfo: (
    user: User,
    profile: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  navigate: (path: string) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class AuthPresenter<V extends AuthView> {
  private _view: V;

  protected constructor(view: V) {
    this._view = view;
  }

  protected get view(): V {
    return this._view;
  }
}
