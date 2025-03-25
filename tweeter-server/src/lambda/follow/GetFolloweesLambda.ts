import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { GetUsers } from "./GetUsers";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
    const followService = new FollowService();
    return GetUsers(() => followService.loadMoreFollowees(request.token, request.alias, request.pageSize, request.lastItem));
}
