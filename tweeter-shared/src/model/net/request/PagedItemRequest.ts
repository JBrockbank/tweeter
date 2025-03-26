import { TweeterRequest } from "./TweeterRequest";

export interface PagedItemRequest<T> extends TweeterRequest {
    readonly alias: string,
    readonly pageSize: number,
    readonly lastItem: T | null
}