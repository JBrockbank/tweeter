import { User, AuthToken } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  private serverFacade = new ServerFacade();

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {

    return await this.serverFacade.login(alias, password);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");
    
    return await this.serverFacade.register(firstName, lastName, alias, password, imageStringBase64, imageFileExtension);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await await this.serverFacade.logout(authToken.token);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return await this.serverFacade.getUser(authToken.token, alias);
  }
}
