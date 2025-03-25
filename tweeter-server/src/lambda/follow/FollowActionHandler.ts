import { FollowActionResponse } from "tweeter-shared";

export async function FollowActionHandler(method: () => Promise<[number, number]>): Promise<FollowActionResponse> {
    const [followeeCount, followerCount] = await method();

    return {
        successIndicator: true,
        message: null,
        followeeCount: followeeCount,
        followerCount: followerCount
    }
}