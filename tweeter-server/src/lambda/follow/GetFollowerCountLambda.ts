import { GetCountRequest, GetCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { GetCount } from "./GetCount";
import { getFollowService } from "../util";

export const handler = async (request: GetCountRequest): Promise<GetCountResponse> => {
    const followService = getFollowService();
    return GetCount(() => followService.getFollowerCount(request.authToken, request.user))

}