import { UserDto } from "./UserDto";

export interface StatusDto {
    readonly alias: string;
    readonly post: string;
    readonly user: UserDto;
    readonly timestamp: number;
}