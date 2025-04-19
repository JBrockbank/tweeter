import { LoginRequest } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../src/presenters/PostStatusPresenter";
import { anything, instance, mock, spy, verify } from "@typestrong/ts-mockito";
import "isomorphic-fetch";
import { ServerFacade } from "../src/network/ServerFacade";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let serverFacade: ServerFacade;
  let postStatusPresenter: PostStatusPresenter;

  const event = anything();
  event.preventDefault = jest.fn();
  const beginTestTimestamp = Date.now();
  const post: string =
    "I don't do ships2 - Time: " +
    beginTestTimestamp;

  const alias: string = "@batman";
  const password: string = "fast";

  beforeEach(() => {
    serverFacade = new ServerFacade();
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);
  });

  it("Logs User In, Posts a status, Finds the status in their story", async () => {
    const [user, authToken] = await serverFacade.login(alias, password);

    await postStatusPresenter.submitPost(event, authToken, user, post);

    verify(mockPostStatusView.displayErrorMessage(anything())).never();

    // Allowing time for it to post the message
    await new Promise((f) => setTimeout(f, 2000));

    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();

    const [storyItems] = await serverFacade.getMoreStoryItems(
      authToken.token,
      user.alias,
      10,
      null
    );
    const latestPost = storyItems.at(0);
    if (latestPost === undefined) {
      fail("unable to retrieve latest story");
    }
    expect(latestPost.post).toBe(post);
    expect(latestPost.user).toStrictEqual(user);
    expect(latestPost.timestamp).toBeGreaterThan(beginTestTimestamp);
  }, 10000);
});
