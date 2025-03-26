import { AuthToken } from "tweeter-shared";
import {
  NavBarPresenter,
  NavBarView,
} from "../../src/presenters/NavBarPresenter";
import {
  anything,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { UserService } from "../../src/model/service/UserService";

describe("NavBarPresenter", () => {
  let mockNavBarView: NavBarView;
  let navBarPresenter: NavBarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("token", Date.now());

  beforeEach(() => {
    mockNavBarView = mock<NavBarView>();
    const mockNavBarViewInstance = instance(mockNavBarView);

    const navBarPresenterSpy = spy(new NavBarPresenter(mockNavBarViewInstance));

    navBarPresenter = instance(navBarPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(navBarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  });

  it("tells the view to display a logging out message", async () => {
    await navBarPresenter.logOut(authToken);
    verify(mockNavBarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await navBarPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();
  });

  it("tells the view to clear the last info message and clear the user info when logout is succesful", async () => {
    await navBarPresenter.logOut(authToken);
    verify(mockNavBarView.clearLastInfoMessage()).once();
    verify(mockNavBarView.clearUserInfo()).once();
  });

  it("tells the view to display an error message and does not tell it to clear the last info message or clear the user info when logout fails", async () => {
    const error = new Error("Failed to logout");
    when(mockUserService.logout(authToken)).thenThrow(error);

    await navBarPresenter.logOut(authToken);
    verify(
      mockNavBarView.displayErrorMessage(
        "Failed to log user out because of exception: Failed to logout"
      )
    ).once();
    verify(mockNavBarView.clearLastInfoMessage()).never();
    verify(mockNavBarView.clearUserInfo()).never();
  });
});
