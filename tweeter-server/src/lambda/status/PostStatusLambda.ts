import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { getStatusService } from "../util";

export const handler = async (request: PostStatusRequest): Promise<PostStatusResponse> => {
    const statusService = getStatusService();
    await statusService.postStatus(request.authToken, request.newStatus);

    return {
        successIndicator: true,
        message: null
    }
}