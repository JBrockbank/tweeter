import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter, View } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setPost(post: string): void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private statusService: any;
  public isLoading = false;

  public constructor(view: PostStatusView) {
    super(view);
    this.statusService = new StatusService();
  }

  public async submitPost(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User | null,
    post: string
  ): Promise<void> {
    event.preventDefault();
    this.doFailureRecordingOperation(
      async () => {
        this.isLoading = true;
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
        this.isLoading = false;
      }
    );
  }
  

  public clearPost(event: React.MouseEvent) {
    event.preventDefault();
    this.view.setPost("");
  }
}
