import {
  AuthResponse,
  AuthToken,
  AuthTokenDto,
  FollowActionRequest,
  FollowActionResponse,
  GetCountRequest,
  GetCountResponse,
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LogoutRequest,
  LogoutResponse,
  PagedItemRequest,
  PagedItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
  Status,
  StatusDto,
  TweeterRequest,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "TODO: Set this value.";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  private async fetchPagedItems<
    TRequest extends TweeterRequest,
    TResponseItem,
    TOutputItem
  >(
    request: TRequest,
    endpoint: string,
    mapToOutputItem: (item: TResponseItem) => TOutputItem | null
  ): Promise<[TOutputItem[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      TRequest,
      PagedItemResponse<TResponseItem>
    >(request, endpoint);

    const items: TOutputItem[] =
      response.successIndicator && response.items
        ? response.items
            .map(mapToOutputItem)
            .filter((item): item is TOutputItem => item !== null)
        : [];

    if (response.successIndicator) {
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message || "An error occurred");
    }
  }

  public async getMoreFollowees(
    authToken: string,
    alias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    var lastItemDto: UserDto | null = null;
    if(lastItem){
        lastItemDto = lastItem.dto;
    }
    const req: PagedItemRequest<UserDto> = {
      authToken,
      alias,
      pageSize,
      lastItem: lastItemDto,
    };
    console.log("Server Facade getMoreFollowees() - lastItem: " + lastItem);
    return this.fetchPagedItems(req, "/followee/list", (dto: UserDto) =>
      User.fromDto(dto)
    );
  }

  public async getMoreFollowers(
    authToken: string,
    alias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    var lastItemDto: UserDto | null = null;
    if(lastItem){
        lastItemDto = lastItem.dto;
    }
    const req: PagedItemRequest<UserDto> = {
      authToken,
      alias,
      pageSize,
      lastItem: lastItemDto,
    };
    return this.fetchPagedItems(req, "/follower/list", (dto: UserDto) =>
      User.fromDto(dto)
    );
  }

  public async getMoreStoryItems(
    authToken: string,
    alias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    var lastItemDto: StatusDto | null = null;
    if(lastItem){
        lastItemDto = lastItem.dto;
    }
    const req: PagedItemRequest<StatusDto> = {
      authToken,
      alias,
      pageSize,
      lastItem: lastItemDto,
    };
    return this.fetchPagedItems(req, "/statusItem/story", (dto: StatusDto) =>
      Status.fromDto(dto)
    );
  }

  public async getMoreFeedItems(
    authToken: string,
    alias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    var lastItemDto: StatusDto | null = null;
    if(lastItem){
        lastItemDto = lastItem.dto;
    }
    const req: PagedItemRequest<StatusDto> = {
      authToken,
      alias,
      pageSize,
      lastItem: lastItemDto,
    };
    return this.fetchPagedItems(req, "/statusItem/feed", (dto: StatusDto) =>
      Status.fromDto(dto)
    );
  }

  public async getIsFollowerStatus(
    authToken: string,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    var userDto = user.dto;
    var selectedUserDto = selectedUser.dto;
    const request = { authToken, user: userDto, selectedUser: selectedUserDto };
    const response = await this.clientCommunicator.doPost<
      GetIsFollowerStatusRequest,
      GetIsFollowerStatusResponse
    >(request, "/follower/status");

    if (response.successIndicator) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message || "An error occurred");
    }
  }

  private async getCount(
    authToken: string,
    user: UserDto,
    endpoint: string
  ): Promise<number> {
    const req = { authToken, user };

    const res = await this.clientCommunicator.doPost<
      GetCountRequest,
      GetCountResponse
    >(req, endpoint);

    if (res.successIndicator) {
      return res.count;
    } else {
      throw new Error(res.message || "An Error Occurred");
    }
  }

  public async getFolloweeCount(
    authToken: string,
    user: UserDto
  ): Promise<number> {
    return this.getCount(authToken, user, "/followee/count");
  }

  public async getFollowerCount(
    authToken: string,
    user: UserDto
  ): Promise<number> {
    return this.getCount(authToken, user, "/follower/count");
  }

  private async performFollowAction(
    authToken: string,
    user: UserDto,
    endpoint: string
  ): Promise<[number, number]> {
    const req = { authToken, user };

    const res = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(req, endpoint);

    if (res.successIndicator) {
      return [res.followeeCount, res.followerCount];
    } else {
      throw new Error(res.message || "An Error Occurred");
    }
  }

  public async follow(
    authToken: string,
    user: UserDto
  ): Promise<[number, number]> {
    return this.performFollowAction(authToken, user, "/followee/follow");
  }

  public async unfollow(
    authToken: string,
    user: UserDto
  ): Promise<[number, number]> {
    return this.performFollowAction(authToken, user, "/followee/unfollow");
  }


  public async logout(authToken: string): Promise<void> {
    const req = { authToken };

    const res = await this.clientCommunicator.doPost<
      LogoutRequest,
      LogoutResponse
    >(req, "/logout");

    if (res.successIndicator) {
      return;
    } else {
      throw new Error(res.message || "An Error Occurred");
    }
  }

  private async authenticateUser<TRequest extends TweeterRequest>(
    request: TRequest,
    endpoint: string
  ): Promise<[User, AuthToken]> {
    const res = await this.clientCommunicator.doPost<TRequest, AuthResponse>(request, endpoint);

    if (res.successIndicator) {
      const user = User.fromDto(res.user);
      const authToken = AuthToken.fromDto(res.authToken);
      if(user !== null && authToken !== null){
        return [user, authToken];
      } else {
        throw new Error(res.message || "User not found");
      }
    } else {
      throw new Error(res.message || "An Error Occurred");
    }
  }


  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const req: LoginRequest = { authToken: "token", alias, password };
    return this.authenticateUser(req, "/login");
  }


  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const req: RegisterRequest = {
      authToken: "token",
      firstName,
      lastName,
      alias,
      password,
      userImageBytes,
      imageFileExtension
    };
    return this.authenticateUser(req, "/register");
  }


  public async getUser(authToken: string, alias: string): Promise<User> {
    const req = { authToken, alias };

    const res = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(req, "/user");
    const user = User.fromDto(res.user);

    if (res.successIndicator) {
      if (user !== null && user !== undefined) {
        return user;
      } else {
        throw new Error(res.message || "User Not Found");
      }
    } else {
      throw new Error(res.message || "An Error Occurred");
    }
  }

  public async postStatus(
    authToken: string,
    newStatus: StatusDto
  ): Promise<void> {
    const req = { authToken, newStatus };

    const res = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(req, "/status");

    if (res.successIndicator) {
      return;
    } else {
      throw new Error(res.message || "An Error Occurred");
    }
  }
}
