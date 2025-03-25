import { TweeterResponse } from "./TweeterResponse";

export interface FollowActionResponse extends TweeterResponse {
    readonly followeeCount: number;
    readonly followerCount: number;
}