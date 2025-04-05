import { GetUserResponse } from "tweeter-shared";
import { GetUserRequest } from "tweeter-shared";
import { getUserService } from "../util";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
    const userService = getUserService();
    const userDto = await userService.getUser(request.authToken, request.alias);

    return {
        successIndicator: true,
        message: null,
        user: userDto
    }

}