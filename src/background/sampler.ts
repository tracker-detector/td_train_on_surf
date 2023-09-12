import { inject, injectable } from "inversify";
import { type IExtractor, ISampler, TYPES, type ISettings } from "./types";
import * as tf from "@tensorflow/tfjs-core";
import { WebRequest } from "webextension-polyfill";

@injectable()
export class RandomSampler implements ISampler {
  private windowSize: number = 512;
  private window: WebRequest.OnBeforeSendHeadersDetailsType[] = [];

  constructor(
    @inject(TYPES.IExtractor) private featureExtractor: IExtractor,
    @inject(TYPES.ISettings) private settings: ISettings
  ) {}

  addTracker(X: WebRequest.OnBeforeSendHeadersDetailsType): void {
    this.window.push(X);
    while (this.window.length > this.windowSize) {
      this.window.shift();
    }
  }

  sample(
    X: WebRequest.OnBeforeSendHeadersDetailsType[],
    y: boolean[]
  ): [tf.Tensor, tf.Tensor] {
    if (
      X.length !== this.settings.chunkSize ||
      y.length !== this.settings.chunkSize
    ) {
      throw new Error("Invalid input lengths.");
    }
    if (y.filter((x) => x).length == 0 && this.window.length == 0) {
      throw new Error(
        "No true labels found in dataset skip training for batch"
      );
    }

    const desiredLength = 6 * this.settings.chunkSize;
    const halfLength = desiredLength / 2;
    const trueSamples: WebRequest.OnBeforeSendHeadersDetailsType[] = [];
    const falseSamples: WebRequest.OnBeforeSendHeadersDetailsType[] = [];

    // Classify samples based on their labels
    for (let i = 0; i < this.settings.chunkSize; i++) {
      if (y[i]) {
        trueSamples.push(X[i]);
      } else {
        falseSamples.push(X[i]);
      }
    }

    for (
      let i = this.window.length - 1;
      i > 0 && trueSamples.length < halfLength;
      i--
    ) {
      trueSamples.push(
        this.window[i] as WebRequest.OnBeforeSendHeadersDetailsType
      );
    }

    // Oversample true samples if required
    while (trueSamples.length < halfLength) {
      const index = Math.floor(Math.random() * trueSamples.length);
      trueSamples.push(trueSamples[index]);
    }

    // Oversample false samples if required
    while (falseSamples.length < halfLength) {
      const index = Math.floor(Math.random() * falseSamples.length);
      falseSamples.push(falseSamples[index]);
    }

    const sampledX = [...trueSamples, ...falseSamples];
    const sampledY = new Array<number>(desiredLength)
      .fill(1, 0, halfLength)
      .fill(0, halfLength);
    const encodedX = tf.stack(
      sampledX.map((x) => this.featureExtractor.extract(x))
    );

    // Convert to tf.Tensor and return (assuming your samples can be directly converted)
    return [encodedX, tf.reshape(tf.tensor(sampledY), [desiredLength])];
  }
}
