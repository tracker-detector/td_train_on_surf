import browser from "webextension-polyfill";
import { inject, injectable } from "inversify";
import {
  IAsyncQueue,
  TYPES,
  type IModel,
  type ISampler,
  type ISettings,
} from "./types";
@injectable()
class AsyncQueue implements IAsyncQueue {
  private queue: [
    browser.WebRequest.OnBeforeSendHeadersDetailsType,
    boolean
  ][] = [];
  private isProcessing: boolean = false;

  constructor(
    @inject(TYPES.IModel) private model: IModel,
    @inject(TYPES.ISampler) private sampler: ISampler,
    @inject(TYPES.ISettings) private settings: ISettings
  ) {}

  enqueue(
    data: browser.WebRequest.OnBeforeSendHeadersDetailsType,
    label: boolean
  ) {
    this.queue.push([data, label]);
    if (!this.isProcessing) {
      setTimeout(() => this.processNext(), 0);
    }
  }

  processNext() {
    if (
      this.queue.length === 0 ||
      this.isProcessing ||
      this.queue.length < this.settings.chunkSize
    ) {
      return;
    }
    const batch = this.queue.splice(0, this.settings.chunkSize);
    try {
      const [X, y] = this.sampler.sample(
        batch.map((x) => x[0]),
        batch.map((x) => x[1])
      );
      this.isProcessing = true;
      this.model.train(X, y, (hist) => {
        console.log(hist);
        this.isProcessing = false;
        this.processNext();
      });
    } catch (e) {
      console.log(e);
    }
  }
}
export { AsyncQueue };
