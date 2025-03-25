import { PagedItemResponse } from "tweeter-shared";

export async function GetItems<T>(method: () => Promise<[T[], boolean]>): Promise<PagedItemResponse<T>> {
    const [items, hasMore] = await method();
    
    return {
        successIndicator: true,
        message: null,
        items,
        hasMore,
    };

}