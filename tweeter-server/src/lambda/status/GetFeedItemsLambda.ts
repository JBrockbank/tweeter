import { PagedItemRequest, PagedItemResponse, StatusDto, UserDto } from "tweeter-shared";
import { GetItems } from "../GetItems";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: PagedItemRequest<StatusDto>): Promise<PagedItemResponse<StatusDto>> => {
    const statusService = new StatusService();
    return GetItems<StatusDto>(() => statusService.loadMoreFeedItems(request.authToken, request.alias, request.pageSize, request.lastItem));
}
