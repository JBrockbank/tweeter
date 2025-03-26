import { FollowActionRequest, FollowActionResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowActionHandler } from "./FollowActionHandler";

export const handler = async (request: FollowActionRequest): Promise<FollowActionResponse> => {
    const followService = new FollowService();
    return FollowActionHandler(() => followService.unfollow(request.authToken, request.user));
}