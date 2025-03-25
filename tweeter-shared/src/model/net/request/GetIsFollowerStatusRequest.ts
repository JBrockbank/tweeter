import { UserDto } from "../../dto/UserDto";

export interface GetIsFollowerStatusRequest {
    readonly token: string;
    readonly user: UserDto;
    readonly selectedUser: UserDto;
}

