import { GetCountRequest, GetCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { GetCount } from "./GetCount";

export const handler = async (request: GetCountRequest): Promise<GetCountResponse> => {
    const followService = new FollowService();
    return GetCount(() => followService.getFollowerCount(request.token, request.user))

}