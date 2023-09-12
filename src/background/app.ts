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
} from "./types";

@injectable()
class App implements IApp {
  private static readonly URL_FILTER = { urls: ["http://*/*", "https://*/*"] };
  constructor(
    @inject(TYPES.ITPLService) private tplService: ITPLService,
    @inject(TYPES.IExtractor) private featureExtractor: IExtractor,
    @inject(TYPES.IAsyncQueue) private queue: IAsyncQueue,
    @inject(TYPES.IModel) private model: IModel
  ) {}

  start(): void {
    browser.webRequest.onBeforeSendHeaders.addListener(
      (details) => {
        const label = this.tplService.classify(details);
        const featureVector = this.featureExtractor.extract(details);
        const result = this.model.predict(tf.reshape(featureVector, [1, 203]));
        console.log(label, result);
        const labelVector = tf.tensor([label ? 1 : 0]);
        this.queue.enqueue(featureVector, labelVector);
        return { cancel: label };
      },
      App.URL_FILTER,
      ["requestHeaders", "blocking"]
    );
    console.log("Application Started");
  }
}

export { App };
