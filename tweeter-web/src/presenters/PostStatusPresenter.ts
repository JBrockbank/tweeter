import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
  displayInfoMessage(
    message: string,
    duration: number,
    bootstrapClasses?: string
  ): void;
  displayErrorMessage(message: string, bootstrapClasses?: string): void;
  clearLastInfoMessage(): void;
  setPost(post: string): void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private statusService: any;
  private _isLoading = false;

  public get isLoading() {
    return this._isLoading;
  }

  public constructor(view: PostStatusView) {
    super(view);
    this.statusService = new StatusService();
  }

  public async submitPost(event: React.MouseEvent, authToken: AuthToken, currentUser: User | null, post: string) {
    event.preventDefault();
    this.doFailureRecordingOperation(
      async () => {
        this._isLoading = true;
        this.view.displayInfoMessage("Posting status...", 0);
  
        const status = new Status(post, currentUser!, Date.now());
  
        await this.statusService.postStatus(authToken!, status);
  
        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => {
        this.view.clearLastInfoMessage();
        this._isLoading = false;
      });
  }

  public clearPost(event: React.MouseEvent) {
    event.preventDefault();
    this.view.setPost("");
  };
}
