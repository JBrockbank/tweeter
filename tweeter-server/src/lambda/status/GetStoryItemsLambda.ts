import { PagedItemRequest, PagedItemResponse, StatusDto, UserDto } from "tweeter-shared";
import { GetItems } from "../GetItems";
import { getStatusService } from "../util";

export const handler = async (request: PagedItemRequest<StatusDto>): Promise<PagedItemResponse<StatusDto>> => {
    const statusService = getStatusService();
    return GetItems<StatusDto>(() => statusService.loadMoreStoryItems(request.authToken, request.alias, request.pageSize, request.lastItem));
}
