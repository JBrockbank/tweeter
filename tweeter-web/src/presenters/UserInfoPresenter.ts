import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, MessageView } from "./Presenter";
import { FollowService } from "../model/service/FollowService";


export interface UserInfoView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;
  public isFollower = false;
  public followeeCount = -1;
  public followerCount = -1;
  public isLoading = false;

  public constructor(view: UserInfoView) {
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
        console.log(`Users are different. current: ${currentUser.alias}, displayed: ${displayedUser.alias}`)
        this.isFollower = await this.followService.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        );
        if(this.isFollower){
          console.log(`Found that ${currentUser.alias} is a follower of ${displayedUser.alias}`)
        } else {
          console.log(`Found that ${currentUser.alias} is not a follower of ${displayedUser.alias}`)
        }
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
      this.followerCount = await this.followService.getFollowerCount(
        authToken,
        displayedUser
      );
    }, "get followers count for ");
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
