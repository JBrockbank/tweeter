import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { GetItems } from "../GetItems";

export const handler = async (request: PagedItemRequest<UserDto>): Promise<PagedItemResponse<UserDto>> => {
    const followService = new FollowService();
    return GetItems<UserDto>(() => followService.loadMoreFollowers(request.token, request.alias, request.pageSize, request.lastItem));
}
