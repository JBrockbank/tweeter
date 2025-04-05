import { AuthToken, AuthTokenDto, UserDto } from "tweeter-shared";

export interface AuthTokenDAO {
    createSession(authToken: AuthToken, user: UserDto): Promise<void>;
    verifySession(authToken: AuthTokenDto): Promise<boolean>;
    getAliasFromToken(token: string): Promise<string>;
    endSession(token: string): Promise<void>;
  }
