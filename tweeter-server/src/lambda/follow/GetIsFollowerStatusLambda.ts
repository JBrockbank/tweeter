import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
    request: GetIsFollowerStatusRequest
): Promise<GetIsFollowerStatusResponse> => {
    const followService = new FollowService();
    const isFollower = await followService.getIsFollowerStatus(request.authToken, request.user, request.selectedUser);

    return {
        successIndicator: true,
        message: null,
        isFollower: isFollower,
    };
}