import {
  PostStatusPresenter,
  PostStatusView,
} from "../../../src/presenters/PostStatusPresenter";
import { StatusService } from "../../../src/model/service/StatusService";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { AuthToken, Status, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("token", Date.now());

  const MouseEvent = { preventDefault: () => {} };
  const testPost = "test post";
  const testUser = new User(
    "testFirstName",
    "testLastName",
    "testAlias",
    "testImage"
  );
  const testStatus = new Status(testPost, testUser, Date.now());

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );

    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.statusService).thenReturn(
      mockStatusServiceInstance
    );
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(
      MouseEvent as React.MouseEvent,
      authToken,
      testUser,
      testPost
    );
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(
      MouseEvent as React.MouseEvent,
      authToken,
      testUser,
      testPost
    );
    verify(mockStatusService.postStatus(authToken, anything())).once();

    let [capturedAuthToken, capturedStatus] = capture(
      mockStatusService.postStatus
    ).last();
    expect(capturedStatus.post).toEqual(testPost);
    expect(capturedAuthToken).toEqual(authToken);
  });

  it("tells the view to clear the last info message, clear the post, and display a status posted message when post is succesful", async () => {
    await postStatusPresenter.submitPost(
      MouseEvent as React.MouseEvent,
      authToken,
      testUser,
      testPost
    );
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();
  });

  it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message when post fails", async () => {
    const error = new Error("Failed to post");
    when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);

    await postStatusPresenter.submitPost(
      MouseEvent as React.MouseEvent,
      authToken,
      testUser,
      testPost
    );
    verify(
      mockPostStatusView.displayErrorMessage(
        "Failed to post the status because of exception: Failed to post"
      )
    ).once();
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).never();
  });
});
