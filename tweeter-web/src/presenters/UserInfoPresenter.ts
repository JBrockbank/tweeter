import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { View, Presenter } from "./Presenter";

export interface UserInfoView extends View {
  displayErrorMessage(message: string): void;
  displayInfoMessage(message: string, duration: number): void;
  clearLastInfoMessage(): void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private userService: UserService;
  public isFollower = false;
  public followeeCount = -1;
  public followerCount = -1;
  public isLoading = false;

  public constructor(view: UserInfoView) {
    super(view);
    this.userService = new UserService();
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
        this.isFollower = await this.userService.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        );
      }
    }, "determine follower status");
  };

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureRecordingOperation(async () => {
      this.followeeCount = await this.userService.getFolloweeCount(
        authToken,
        displayedUser
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureRecordingOperation(async () => {
      this.followeeCount = await this.userService.getFollowerCount(
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

        const [followerCount, followeeCount] = await this.userService.follow(
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

        const [followerCount, followeeCount] = await this.userService.unfollow(
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
