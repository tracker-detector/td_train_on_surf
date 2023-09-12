import browser from "webextension-polyfill";
import * as tf from "@tensorflow/tfjs";
export const TYPES = {
  ITPLService: Symbol.for("ITPLService"),
  IExtractor: Symbol.for("IExtractor"),
  IAsyncQueue: Symbol.for("IAsyncQueue"),
  IModel: Symbol.for("IModel"),
  ISampler: Symbol.for("ISampler"),
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
  enqueue(
    data: browser.WebRequest.OnBeforeSendHeadersDetailsType,
    label: boolean
  ): void;
}

export interface IModel {
  train(
    data: tf.Tensor,
    label: tf.Tensor,
    cb: (hist: tf.History) => void
  ): void;
  predict(encodedData: tf.Tensor): number;
}

export interface ISampler {
  addTracker(X: browser.WebRequest.OnBeforeSendHeadersDetailsType): void;
  sample(
    X: browser.WebRequest.OnBeforeSendHeadersDetailsType[],
    y: boolean[]
  ): [tf.Tensor, tf.Tensor];
}
