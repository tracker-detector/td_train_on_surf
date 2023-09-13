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
  type ISettings,
  type IStats,
} from "./types";

@injectable()
class App implements IApp {
  private static readonly URL_FILTER = { urls: ["http://*/*", "https://*/*"] };
  constructor(
    @inject(TYPES.ITPLService) private tplService: ITPLService,
    @inject(TYPES.IExtractor) private featureExtractor: IExtractor,
    @inject(TYPES.IAsyncQueue) private queue: IAsyncQueue,
    @inject(TYPES.IModel) private model: IModel,
    @inject(TYPES.ISampler) private sampler: ISampler,
    @inject(TYPES.ISettings) private settings: ISettings,
    @inject(TYPES.IStats) private stats: IStats
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
        this.stats.addRequests(details, label, result);
        this.queue.enqueue(details, label);
        if (this.settings.modelActive) {
          return {
            cancel:
              result >= this.settings.blockingRate &&
              this.settings.blockingActive,
          };
        } else {
          return { cancel: label && this.settings.blockingActive };
        }
      },
      App.URL_FILTER,
      ["requestHeaders", "blocking"]
    );
    console.log("Application Started");
  }
}

export { App };
