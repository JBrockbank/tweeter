import { User, AuthToken, FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
import { Buffer } from "buffer";

export class UserService {
  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    const userDto = user.dto;

    return [userDto, (FakeData.instance.authToken).dto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    // const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  public async logout(token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }

  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    const user = FakeData.instance.findUserByAlias(alias);
    if (user === null) {
      throw new Error("No User Found with alias");
    }
    return user.dto;
  }
}
