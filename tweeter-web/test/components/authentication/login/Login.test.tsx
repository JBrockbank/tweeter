// import { MemoryRouter } from "react-router-dom";
// import Login from "../../../../src/components/authentication/login/Login";
// import { render, screen } from "@testing-library/react";
// import React from "react";
// import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
// import { AuthView } from "../../../../src/presenters/AuthPresenter";
// import userEvent, { UserEvent } from "@testing-library/user-event";
// import "@testing-library/jest-dom";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";
// import { anything, instance, mock, verify } from "@typestrong/ts-mockito";

// library.add(fab);

// describe("Login Component", () => {
//   it("starts with the sign-in button disabled", () => {
//     const { signInButton } = renderLoginAndGetElement("/");
//     expect(signInButton).toBeDisabled();
//   });

//   it("enables the sign in button if both alias and password fields have text", async () => {
//     const { signInButton, aliasField, passwordField, user } =
//       renderLoginAndGetElement("/");

//     await testSignInButton(user, signInButton, aliasField, passwordField);
//   });

//   it("disables the sign in button if either alias or password fields are cleared", async () => {
//     const { signInButton, aliasField, passwordField, user } =
//       renderLoginAndGetElement("/");

//     await testSignInButton(user, signInButton, aliasField, passwordField);

//     await user.clear(aliasField);
//     expect(signInButton).toBeDisabled();

//     await user.type(aliasField, "a");
//     expect(signInButton).toBeEnabled();

//     await user.clear(passwordField);

//     expect(signInButton).toBeDisabled();
//   });

//   it("calls the presenter's login method with correct params when the sign-in button is pressed", async () => {
//     const mockPresenter = mock<LoginPresenter>();
//     const mockPresenterInstance = instance(mockPresenter);

//     const originalUrl = "http://someurl.com";
//     const alias = "@someAlias";
//     const password = "myPassword";

//     const { signInButton, aliasField, passwordField, user } =
//       renderLoginAndGetElement(originalUrl, mockPresenterInstance);

//     await user.type(aliasField, alias);
//     await user.type(passwordField, password);

//     await user.click(signInButton);

//     verify(
//       mockPresenter.doLogin(alias, password, originalUrl, anything())
//     ).once();
//   });
// });

// const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
//   return render(
//     <MemoryRouter>
//       <Login
//         originalUrl={originalUrl}
//         presenterGenerator={(view: AuthView) =>
//           presenter ?? new LoginPresenter(view)
//         }
//       />
//     </MemoryRouter>
//   );
// };

// const renderLoginAndGetElement = (
//   orignalUrl: string,
//   presenter?: LoginPresenter
// ) => {
//   const user = userEvent.setup();

//   renderLogin(orignalUrl, presenter);

//   //   screen.debug();

//   const signInButton = screen.getByRole("button", { name: /Sign in/i });
//   const aliasField = screen.getByLabelText("alias");
//   const passwordField = screen.getByLabelText("password");

//   return { signInButton, aliasField, passwordField, user };
// };

// async function testSignInButton(
//   user: UserEvent,
//   signInButton: HTMLElement,
//   aliasField: HTMLElement,
//   passwordField: HTMLElement
// ) {
//   await user.type(aliasField, "alias");
//   await user.type(passwordField, "password");

//   expect(signInButton).toBeEnabled();
// }
