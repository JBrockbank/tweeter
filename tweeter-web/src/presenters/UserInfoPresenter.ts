import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, MessageView } from "./Presenter";
import { FollowService } from "../model/service/FollowService";

export class UserInfoPresenter extends Presenter<MessageView> {
  private followService: FollowService;
  public isFollower = false;
  public followeeCount = -1;
  public followerCount = -1;
  public isLoading = false;

  public constructor(view: MessageView) {
    super(view);
    this.followService = new FollowService();
  }

  setIsFollowerStatus = async (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) => {
    this.doFailureRecordingOperation(async () => {
      if (currentUser === displayedUser) {
        this.isFollower = false;
      } else {
        this.isFollower = await this.followService.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        );
      }
    }, "determine follower status");
  };

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureRecordingOperation(async () => {
      this.followeeCount = await this.followService.getFolloweeCount(
        authToken,
        displayedUser
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureRecordingOperation(async () => {
      this.followeeCount = await this.followService.getFollowerCount(
        authToken,
        displayedUser
      );
    }, "get followers count");
  }

  public async followDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    event.preventDefault();
    this.doFailureRecordingOperation(
      async () => {
        this.isLoading = true;
        this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

        const [followerCount, followeeCount] = await this.followService.follow(
          authToken!,
          displayedUser!
        );

        this.isFollower = true;
        this.followerCount = followerCount;
        this.followeeCount = followeeCount;
      },
      "follow user",
      () => {
        this.view.clearLastInfoMessage();
        this.isLoading = false;
      }
    );
  }

  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    event.preventDefault();
    this.doFailureRecordingOperation(
      async () => {
        this.isLoading = true;
        this.view.displayInfoMessage(
          `Unfollowing ${displayedUser!.name}...`,
          0
        );

        const [followerCount, followeeCount] = await this.followService.unfollow(
          authToken!,
          displayedUser!
        );

        this.isFollower = false;
        this.followerCount = followerCount;
        this.followeeCount = followeeCount;
      },
      "unfollow user",
      () => {
        this.view.clearLastInfoMessage();
        this.isLoading = false;
      }
    );
  }
}
