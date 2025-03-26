import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter, View } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost(post: string): void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: any;
  private _isLoading = false;

  public get isLoading() {
    return this._isLoading;
  }

  public constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public get statusService() {
    return this._statusService;
  }  

  public async submitPost(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User | null,
    post: string
  ) {
    event.preventDefault();
    await this.doFailureRecordingOperation(
      async () => {
        this._isLoading = true;
        this.view.displayInfoMessage("Posting status...", 0);
        console.log("submitPost");

        const status = new Status(post, currentUser!, Date.now());

        await this.statusService.postStatus(authToken!, status);

        console.log("Status Posted");


        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => {
        this.view.clearLastInfoMessage();
        this._isLoading = false;
      }
    );
  }

  public clearPost(event: React.MouseEvent) {
    event.preventDefault();
    this.view.setPost("");
  }
}
