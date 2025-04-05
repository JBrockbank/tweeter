import { StatusDto, UserDto } from "tweeter-shared";

export interface FeedDAO {
  createFollowersFeed(
    user: UserDto,
    userFollowers: string[],
    status: StatusDto
  ): Promise<void>;
  getFeedForUser(
    userAlias: string,
    pageSize: number,
    lastItem?: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
}
