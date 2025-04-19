// import { render, screen } from "@testing-library/react";
// import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
// import { User, AuthToken } from "tweeter-shared";
// import PostStatus from "../../../src/components/postStatus/PostStatus";
// import {
//   PostStatusView,
//   PostStatusPresenter,
// } from "../../../src/presenters/PostStatusPresenter";
// import userEvent, { UserEvent } from "@testing-library/user-event";
// import React from "react";
// import { anything, instance, mock, verify } from "@typestrong/ts-mockito";
// import "@testing-library/jest-dom";

// jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
//   ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
//   __esModule: true,
//   default: jest.fn(),
// }));

// describe("PostStatus Component", () => {
//   const currentUser = new User("morgan", "brock", "jan27", "image.com");

//   const authToken = new AuthToken("token", Date.now());

//   beforeAll(() => {
//     (useUserInfo as jest.Mock).mockReturnValue({
//       currentUser: currentUser,
//       authToken: authToken,
//     });
//   });

//   it("starts with the Post Status and Clear buttons disabled", () => {
//     const { postStatusButton, clearButton } = renderPostStatusAndGetElement();
//     expect(clearButton).toBeDisabled();
//     expect(postStatusButton).toBeDisabled();
//   });

//   it("both buttons are enabled when text field has text", async () => {
//     const { postStatusButton, clearButton, postTextField, user } =
//       renderPostStatusAndGetElement();

//     await testPostButton(user, postTextField, postStatusButton, clearButton);
//   });

//   it("both buttons are disabled when text field is cleared", async () => {
//     const { postStatusButton, clearButton, postTextField, user } =
//       renderPostStatusAndGetElement();

//     await testPostButton(user, postTextField, postStatusButton, clearButton);

//     await user.clear(postTextField);
//     expect(postStatusButton).toBeDisabled();
//     expect(clearButton).toBeDisabled();
//   });

//   it("presenter's postStatus method is called with correct paramaters when the post status button is pressed", async () => {
//     const mockPresenter: PostStatusPresenter = mock<PostStatusPresenter>();
//     const mockPresenterInstance: PostStatusPresenter = instance(mockPresenter);

//     const post = "test";

//     const { postStatusButton, postTextField, user } =
//       renderPostStatusAndGetElement(mockPresenterInstance);

//     await user.type(postTextField, post);

//     await user.click(postStatusButton);

//     verify(
//       mockPresenter.submitPost(anything(), authToken, currentUser, post)
//     ).once();
//   });
// });

// async function testPostButton(
//   user: UserEvent,
//   postTextField: HTMLElement,
//   postStatusButton: HTMLElement,
//   clearButton: HTMLElement
// ) {
//   await user.type(postTextField, "post");

//   expect(postStatusButton).toBeEnabled();
//   expect(clearButton).toBeEnabled();
// }

// const renderPostStatus = (presenter?: PostStatusPresenter) => {
//   return render(
//     <PostStatus
//       presenterGenerator={(view: PostStatusView) =>
//         presenter ?? new PostStatusPresenter(view)
//       }
//     />
//   );
// };

// const renderPostStatusAndGetElement = (presenter?: PostStatusPresenter) => {
//   const user = userEvent.setup();

//   renderPostStatus(presenter);

//   const postTextField = screen.getByLabelText("postStatus");
//   const postStatusButton = screen.getByLabelText("Post Status Button");
//   const clearButton = screen.getByRole("button", { name: /Clear/i });

//   return { postStatusButton, clearButton, postTextField, user };
// };
