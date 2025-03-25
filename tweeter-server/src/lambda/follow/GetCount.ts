import { GetCountResponse } from "tweeter-shared";

export async function GetCount(method: () => Promise<number>): Promise<GetCountResponse> {
    const count = await method();

    return {
        successIndicator: true,
        message: null,
        count: count
    }
}