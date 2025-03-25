import { UserDto } from "../../dto/UserDto";

export interface PagedUserItemRequest {
    readonly token: string,
    readonly alias: string,
    readonly pageSize: number,
    readonly lastItem: UserDto | null
}