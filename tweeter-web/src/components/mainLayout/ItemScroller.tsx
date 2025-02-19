import React, { ReactNode, useEffect, useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { ItemPresenter, ItemView } from "../../presenters/ItemPresenter";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props<V, U extends ItemView<V>, S> {
  presenterGenerator: (view: ItemView<V>) => ItemPresenter<V, U, S>;
  itemComponentGenerator: (item: V) => ReactNode;
}

export const ItemScroller = <V, U extends ItemView<V>, S>(
  props: Props<V, U, S>
) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<V[]>([]);
  const [newItems, setNewItems] = useState<V[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);
  const { presenterGenerator, itemComponentGenerator } = props;

  const { displayedUser, authToken } = useUserInfo();

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
  }, [displayedUser]);

  // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
  useEffect(() => {
    if (changedDisplayedUser) {
      loadMoreItems();
    }
  }, [changedDisplayedUser]);

  // Add new items whenever there are new items to add
  useEffect(() => {
    if (newItems) {
      setItems([...items, ...newItems]);
    }
  }, [newItems]);

  const reset = async () => {
    setItems([]);
    setNewItems([]);
    setChangedDisplayedUser(true);
    presenter.reset();
  };

  const listener: ItemView<V> = {
    addItems: (newItems: V[]) => setNewItems(newItems),
    displayErrorMessage: displayErrorMessage,
  };

  const [presenter] = useState(presenterGenerator(listener));

  const loadMoreItems = async () => {
    presenter.loadMoreItems(authToken!, displayedUser!.alias);
    setChangedDisplayedUser(false);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            {itemComponentGenerator(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
