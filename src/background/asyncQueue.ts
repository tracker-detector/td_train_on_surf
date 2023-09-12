import * as tf from "@tensorflow/tfjs";
import { inject, injectable } from "inversify";
import { IAsyncQueue, TYPES, type IModel } from "./types";
@injectable()
class AsyncQueue implements IAsyncQueue {
  private queue: [tf.Tensor, tf.Tensor][] = [];
  private isProcessing: boolean = false;
  private batchSize: number = 512;
  constructor(@inject(TYPES.IModel) private model: IModel) {}

  enqueue(data: tf.Tensor, label: tf.Tensor) {
    this.queue.push([data, label]);
    if (!this.isProcessing) {
      setTimeout(() => this.processNext(), 0);
    }
  }

  processNext() {
    if (
      this.queue.length === 0 ||
      this.isProcessing ||
      this.queue.length < this.batchSize
    ) {
      return;
    }
    const batch = this.queue.splice(0, this.batchSize);
    const X = tf.stack(batch.map((x) => x[0]));
    const y = tf.reshape(tf.stack(batch.map((x) => x[1])), [this.batchSize]);
    console.log("Process next");

    this.isProcessing = true;
    this.model.train(X, y, (hist) => {
      console.log(hist);
      this.isProcessing = false;
      this.processNext();
    });
  }
}
export { AsyncQueue };
