export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
}

export class Presenter<T extends View> {
  private _view: T;

  protected constructor(view: T) {
    this._view = view;
  }

  protected get view(): T {
    return this._view;
  }

  protected async doFailureRecordingOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    finalOperation?: () => void
  ) {
    try {
      console.log("Trying");
      await operation();
    } catch (error) {
      console.log(`Caught Error: ${(error as Error).message} `)
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${(error as Error).message}`
      );
    } finally {
      if (finalOperation) {
        finalOperation();
      }
    }
  }
}
