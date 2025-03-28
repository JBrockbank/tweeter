import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: PostStatusRequest): Promise<PostStatusResponse> => {
    const statusService = new StatusService();
    await statusService.postStatus(request.authToken, request.newStatus);

    return {
        successIndicator: true,
        message: null
    }
}