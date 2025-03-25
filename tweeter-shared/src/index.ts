// All classes that should be avaialble to other modules need to exported here. export * does not work when 
// uploading to lambda. Instead we have to list each export.

//Domain Classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

//Dtos
export type { UserDto } from "./model/dto/UserDto";

//Requests
export type { PagedUserItemRequest } from "./model/net/request/PagedUserItemRequest";
export type { GetIsFollowerStatusRequest } from "./model/net/request/GetIsFollowerStatusRequest";
export type { GetCountRequest } from "./model/net/request/GetCountRequest";
export type { FollowActionRequest } from "./model/net/request/FollowActionRequest";

//Responses
export type { PagedUserItemResponse } from "./model/net/response/PagedUserItemResponse"
export type { GetIsFollowerStatusResponse } from "./model/net/response/GetIsFollowerStatusResponse";
export type { GetCountResponse } from "./model/net/response/GetCountResponse";
export type { FollowActionResponse } from "./model/net/response/FollowActionResponse";

//Other
export { FakeData } from "./util/FakeData";

