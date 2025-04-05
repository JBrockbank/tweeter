import { FactoryDAO } from "../factory/FactoryDAO";
import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import { FollowDAO } from "../interfaces/FollowDAO";
import { UserDAO } from "../interfaces/UserDAO";
import { AuthTokenDAODynamo } from "./AuthTokenDAODynamo";
import { UserDAODynamo } from "./UserDAODynamo";
import { FollowDAODynamo } from "./FollowDAODynamo";
import { FeedDAO } from "../interfaces/FeedDAO";
import { StatusDAO } from "../interfaces/StatusDAO";
import { FeedDAODynamo } from "./FeedDAODynamo";
import { StatusDAODynamo } from "./StatusDAODynamo";
import { S3DAO } from "../interfaces/S3DAO";
import { S3DAODynamo } from "./S3DAODynamo";

export class FactoryDAODynamo implements FactoryDAO {

    public getUserDAO(): UserDAO {
        return new UserDAODynamo();
      }
    
      public getFeedDAO(): FeedDAO {
        return new FeedDAODynamo();
      }
    
      public getFollowDAO(): FollowDAO {
        return new FollowDAODynamo();
      }
    
      public getS3DAO(): S3DAO {
        return new S3DAODynamo();
      }
    
      public getAuthTokenDAO(): AuthTokenDAO {
        return new AuthTokenDAODynamo();
      }
    
      public getStatusDAO(): StatusDAO {
        return new StatusDAODynamo();
      }
}