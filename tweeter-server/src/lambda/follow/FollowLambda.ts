import { FollowActionRequest, FollowActionResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowActionHandler } from "./FollowActionHandler";
import { getFollowService } from "../util";

export const handler = async (request: FollowActionRequest): Promise<FollowActionResponse> => {
    const followService = getFollowService();
    return FollowActionHandler(() => followService.follow(request.authToken, request.user));
}