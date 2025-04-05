import { FactoryDAODynamo } from "../database/dao/dynamo/FactoryDAODynamo";
import { FollowService } from "../model/service/FollowService";
import { StatusService } from "../model/service/StatusService";
import { UserService } from "../model/service/UserService";

export function getUserService() {
    return new UserService(new FactoryDAODynamo());
}

export function getStatusService() {
    return new StatusService(new FactoryDAODynamo());
  }
  
  export function getFollowService() {
    return new FollowService(new FactoryDAODynamo());
  }