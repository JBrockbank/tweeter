import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { GetItems } from "../GetItems";
import { getFollowService } from "../util";

export const handler = async (request: PagedItemRequest<UserDto>): Promise<PagedItemResponse<UserDto>> => {
    const followService = getFollowService();
    return GetItems<UserDto>(() => followService.loadMoreFollowees(request.authToken, request.alias, request.pageSize, request.lastItem));
}
