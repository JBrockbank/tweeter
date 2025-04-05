import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { getFollowService } from "../util";

export const handler = async (
    request: GetIsFollowerStatusRequest
): Promise<GetIsFollowerStatusResponse> => {
    const followService = getFollowService();
    const isFollower = await followService.getIsFollowerStatus(request.authToken, request.user, request.selectedUser);

    return {
        successIndicator: true,
        message: null,
        isFollower: isFollower,
    };
}