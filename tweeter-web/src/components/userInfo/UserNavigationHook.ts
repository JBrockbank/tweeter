import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";
import { useState } from "react";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenters/UserNavigationPresenter";

interface UserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

interface Props {
  presenterGenerator: (view: UserNavigationView) => UserNavigationPresenter;
}

const useUserNavigationHook = (): UserNavigation => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const listener: UserNavigationView = {
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage,
  };

  const [presenter] = useState(() => new UserNavigationPresenter(listener));

  const navigateToUser = (event: React.MouseEvent) =>
    presenter.navigateToUser(event, authToken!, currentUser!);

  return { navigateToUser };
};

export default useUserNavigationHook;
