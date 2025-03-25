export interface PagedItemRequest<T> {
    readonly token: string,
    readonly alias: string,
    readonly pageSize: number,
    readonly lastItem: T | null
}