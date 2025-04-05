import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import { FeedDAO } from "../interfaces/FeedDAO";
import { FollowDAO } from "../interfaces/FollowDAO";
import { S3DAO } from "../interfaces/S3DAO";
import { StatusDAO } from "../interfaces/StatusDAO";
import { UserDAO } from "../interfaces/UserDAO";


export interface FactoryDAO {
    readonly getFeedDAO: () => FeedDAO;
    readonly getFollowDAO: () => FollowDAO;
    readonly getS3DAO: () => S3DAO;
    readonly getAuthTokenDAO: () => AuthTokenDAO;
    readonly getUserDAO: () => UserDAO;
    readonly getStatusDAO: () => StatusDAO;
  }