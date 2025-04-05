import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { getUserService } from "../util";

export const handler = async (request: RegisterRequest): Promise<AuthResponse> => {
    const userService = getUserService();
    const [userDto, authTokenDto] = await userService.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBytes, request.imageFileExtension);

    return {
        successIndicator: true,
        message: null,
        user: userDto,
        authToken: authTokenDto
    }
}