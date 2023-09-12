import browser from "webextension-polyfill";
import { injectable, inject } from "inversify";
import * as tf from "@tensorflow/tfjs";
import {
  IApp,
  type ITPLService,
  TYPES,
  type IExtractor,
  type IAsyncQueue,
  type IModel,
  type ISampler,
} from "./types";

@injectable()
class App implements IApp {
  private static readonly URL_FILTER = { urls: ["http://*/*", "https://*/*"] };
  constructor(
    @inject(TYPES.ITPLService) private tplService: ITPLService,
    @inject(TYPES.IExtractor) private featureExtractor: IExtractor,
    @inject(TYPES.IAsyncQueue) private queue: IAsyncQueue,
    @inject(TYPES.IModel) private model: IModel,
    @inject(TYPES.ISampler) private sampler: ISampler
  ) {}

  start(): void {
    browser.webRequest.onBeforeSendHeaders.addListener(
      (details) => {
        const label = this.tplService.classify(details);
        if (label) {
          this.sampler.addTracker(details);
        }
        const featureVector = this.featureExtractor.extract(details);
        const result = this.model.predict(tf.reshape(featureVector, [1, 203]));
        console.log(label, result);
        this.queue.enqueue(details, label);
        return { cancel: label };
      },
      App.URL_FILTER,
      ["requestHeaders", "blocking"]
    );
    console.log("Application Started");
  }
}

export { App };
