import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";
import {
  UserDto,
} from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
    let serverFacade: ServerFacade;
  
    beforeAll(() => {
      serverFacade = new ServerFacade();
    });

    test("Get Followers Count functionality", async () => {
        const userDto: UserDto = {
            firstName: "first",
            lastName: "last",
            alias: "@testAlias",
            imageUrl: "url",
          };
        const authToken: string = "token"

        const followerCount = await serverFacade.getFollowerCount(authToken, userDto);

        expect(followerCount).toBeDefined();
        expect(typeof followerCount).toBe("number");
    });


    test("GetFollowers", async () => {
        const authToken = "token";
        const alias = "@testAlias";
        const pageSize = 10;
        const lastItem = null;
    
        const [users, hasMore] = await serverFacade.getMoreFollowers(authToken, alias, pageSize, lastItem);
        expect(users).not.toBeNull();
        expect(typeof hasMore).toBe("boolean");
    });

    test("Register User", async () => {
        const firstName = "first";
        const lastName = "last";
        const alias = "testAlias";
        const password = "pass";
        const userImageBase64 = ""
        const imageFileExtension = ".fileType";
    
        const [user, authToken] = await serverFacade.register(firstName, lastName, alias, password, userImageBase64, imageFileExtension);
        expect(user).toBeDefined();
        expect(user.alias).toBe("@allen");
        expect(authToken).not.toBeNull();
      });
    

});