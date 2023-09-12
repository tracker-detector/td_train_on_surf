import browser from "webextension-polyfill";
import * as tf from "@tensorflow/tfjs";
export const TYPES = {
  ITPLService: Symbol.for("ITPLService"),
  IExtractor: Symbol.for("IExtractor"),
  IAsyncQueue: Symbol.for("IAsyncQueue"),
  IModel: Symbol.for("IModel"),
  IApp: Symbol.for("IApp"),
};
export interface ITPLService {
  init(): Promise<void>;
  classify(details: browser.WebRequest.OnBeforeSendHeadersDetailsType): boolean;
}
export interface IApp {
  start(): void;
}
export interface IExtractor {
  extract(
    details: browser.WebRequest.OnBeforeSendHeadersDetailsType
  ): tf.Tensor;
}

export interface IAsyncQueue {
  enqueue(data: tf.Tensor, label: tf.Tensor): void;
}

export interface IModel {
  train(
    data: tf.Tensor,
    label: tf.Tensor,
    cb: (hist: tf.History) => void
  ): void;
  predict(encodedData: tf.Tensor): number;
}
