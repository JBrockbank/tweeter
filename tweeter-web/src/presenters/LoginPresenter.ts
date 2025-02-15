import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginView extends AuthView{

}

export class LoginPresenter extends AuthPresenter<LoginView> {
    private userService: UserService;
    

    public constructor(view: LoginView) {
        super(view);
        this.userService = new UserService();
    }

    public isLoading  = false;
    
    public async doLogin(alias: string, password: string, originalUrl: string | undefined, rememberMe: boolean): Promise<void> {
        try {
          this.isLoading = true;
    
          const [user, authToken] = await this.userService.login(alias, password);
    
          this.view.updateUserInfo(user, user, authToken, rememberMe);
    
          if (!!originalUrl) {
            this.view.navigate(originalUrl);
          } else {
            this.view.navigate("/");
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to log user in because of exception: ${error}`
          );
        } finally {
          this.isLoading = false;
        }
      };

}