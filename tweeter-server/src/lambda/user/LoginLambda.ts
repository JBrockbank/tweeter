import { LoginRequest, AuthResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
    const userService = new UserService();
    const [userDto, authTokenDto] = await userService.login(request.alias, request.password);

    return {
        successIndicator: true,
        message: null,
        user: userDto,
        authToken: authTokenDto
    }
}