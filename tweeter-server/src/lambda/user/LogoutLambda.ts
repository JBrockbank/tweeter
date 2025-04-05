import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getUserService } from "../util";

export const handler = async (request: LogoutRequest): Promise<LogoutResponse> => {
    const userService = getUserService();
    await userService.logout(request.authToken);

    return {
        successIndicator: true,
        message: null
    }
}