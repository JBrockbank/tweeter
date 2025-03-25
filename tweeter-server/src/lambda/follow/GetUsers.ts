import { PagedUserItemResponse, UserDto } from "tweeter-shared";

export async function GetUsers(method: () => Promise<[UserDto[], boolean]>): Promise<PagedUserItemResponse> {
    const [items, hasMore] = await method();
    
    return {
        successIndicator: true,
        message: null,
        items,
        hasMore,
    };

}