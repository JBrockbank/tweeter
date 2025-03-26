import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
export const PAGE_SIZE = 10;

export interface ItemView<T> extends View {
  addItems: (items: T[]) => void;
}

export abstract class ItemPresenter<
  T,
  U extends ItemView<T>,
  S
> extends Presenter<U> {
  private _hasMoreItems = true;
  private _lastItem: T | null = null;
  private _service: S;

  protected constructor(view: U) {
    super(view);
    this._service = this.createService();
  }

  protected abstract createService(): S;

  protected get service(): S {
    return this._service;
  }

  protected get lastItem(): T | null {
    return this._lastItem;
  }

  protected set lastItem(value: T | null) {
    this._lastItem = value;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  reset() {
    this.lastItem = null;
    this.hasMoreItems = true;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    this.doFailureRecordingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);
      console.log("newItems.length = " + newItems.length)
      if (newItems.length > 0) {
        this.lastItem = newItems[newItems.length - 1];
      } else {
        console.warn("No new items returned. lastItem remains unchanged.");
      }      
      console.log("ItemPresenter: loadMoreItems: lastItem = " + this.lastItem)
      this.hasMoreItems = hasMore;
      console.log("ItemPresenter: loadMoreItems: hasMore = " + hasMore);
      console.log("HERE")
      this.lastItem = newItems[newItems.length - 1];
      console.log("ItemPresenter: loadMoreItems(After1): lastItem = " + this.lastItem)
      this.view.addItems(newItems);
    }, this.getItemDescription());
  }

  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[T[], boolean]>;

  protected abstract getItemDescription(): string;
}
