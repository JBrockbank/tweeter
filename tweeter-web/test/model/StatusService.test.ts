// import "isomorphic-fetch";
// import { StatusService } from "../../src/model/service/StatusService";
// import { AuthToken } from "tweeter-shared";

// describe("StatusService test", () => {
//     const statusService = new StatusService();

//     test("test the return of a user's story pages", async () => {
//         const authToken = new AuthToken("token", Date.now());
//         const userAlias = "@testAlias";
//         const pageSize = 10;
//         const [statusList, hasMore] = await statusService.loadMoreStoryItems(
//             authToken,
//             userAlias,
//             pageSize,
//             null
//         );

//         expect(statusList).not.toBeNull();
//         expect(typeof hasMore).toBe("boolean");
//         expect(statusList.length).toBeLessThanOrEqual(pageSize);
//     })


// });