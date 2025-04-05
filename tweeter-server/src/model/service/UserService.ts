import {
  User,
  FakeData,
  UserDto,
  AuthTokenDto,
  AuthToken,
} from "tweeter-shared";
import { FactoryDAO } from "../../database/dao/factory/FactoryDAO";
import { AuthTokenDAO } from "../../database/dao/interfaces/AuthTokenDAO";
import { UserDAO } from "../../database/dao/interfaces/UserDAO";
import bcrypt from "bcryptjs";
import { S3DAO } from "../../database/dao/interfaces/S3DAO";

const SALT: number = 10;

export class UserService {
  private factoryDAO: FactoryDAO;
  private userDAO: UserDAO;
  private AuthTokenDAO: AuthTokenDAO;
  private s3DAO: S3DAO;

  constructor(factoryDAO: FactoryDAO) {
    this.factoryDAO = factoryDAO;
    this.userDAO = this.factoryDAO.getUserDAO();
    this.AuthTokenDAO = this.factoryDAO.getAuthTokenDAO();
    this.s3DAO = this.factoryDAO.getS3DAO();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    if (!alias || !password) {
      throw new Error("Missing Alias or Password");
    }

    const retrievedUser = await this.userDAO.getUser(alias);

    if (!retrievedUser) {
      throw new Error(`Error in retrieving user: ${alias}`);
    }

    const verified = await this.checkPassword(alias, password);
    if (!verified) {
      throw new Error(`Bad Request: User/Password unable to find match: ${alias}, ${password}`);
    }
    const token = await this.startSession(retrievedUser);
    return [retrievedUser, token];
  }

  private async checkPassword(alias: string, password: string) {
    const hashedPassword = await this.userDAO.getHashedPassword(alias);
    const verified: boolean = await bcrypt.compare(password, hashedPassword);
    return verified;
  }

  private async startSession(user: UserDto) {
    const authToken = AuthToken.Generate();
    await this.AuthTokenDAO.createSession(authToken, user);
    return authToken.dto;
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

    if (await this.userDAO.getUser(alias)) {
      throw new Error("Bad Request: User Alias is taken");
    }

    const validExt = new Set(["jpg", "png", "jpeg"]);
    if (!validExt.has(imageFileExtension.toLowerCase())) {
      console.log(`img File Extension: ${imageFileExtension.toLowerCase()}`);
      throw new Error("Bad Request: Invalid File Type");
    }

    const hashedPassword = await bcrypt.hash(password, SALT);

    const imageUrl = await this.s3DAO.putImage(
      alias,
      userImageBytes,
      imageFileExtension,
    );

    const user = new User(firstName, lastName, alias, imageUrl);

    try {
      await this.userDAO.createUser(user, hashedPassword);
    } catch (error) {
      console.log("Error Registering New User")
      throw new Error((error as Error).message);
    }

    const token = await this.startSession(user.dto);

    return [user.dto, token];
  }

  public async logout(token: string): Promise<void> {
    try {
      await this.AuthTokenDAO.endSession(token);
    } catch (err) {
      throw new Error(
        "Error during logout. Unable to delete authentication token."
      );
    }
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    try {
      const user = await this.userDAO.getUser(alias);   
      return user; 
    }
    catch {
      throw new Error("Unable to get User");
    }
  }
}
