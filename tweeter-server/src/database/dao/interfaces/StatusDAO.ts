import { Status, StatusDto } from "tweeter-shared";

export interface StatusDAO {
    createStatus(status: Status): Promise<void>;
    getPageOfStatuses(
      alias: string,
      pageSize: number,
      lastItem?: StatusDto | null,
    ): Promise<[StatusDto[], boolean]>;
}

