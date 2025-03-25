import { GetUserResponse } from "tweeter-shared";
import { GetUserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
    const userService = new UserService();
    const userDto = await userService.getUser(request.authToken, request.alias);

    return {
        successIndicator: true,
        message: null,
        user: userDto
    }

}