import { inject, injectable } from "inversify";
import { IModel, type ISettings, TYPES } from "./types";
import * as tf from "@tensorflow/tfjs";

let model: tf.LayersModel = tf.sequential({
  layers: [
    tf.layers.embedding({
      inputDim: 90,
      outputDim: 32,
      inputLength: 203,
      maskZero: true,
    }),
    tf.layers.flatten(),
    tf.layers.dense({
      units: 512,
      inputDim: 6496,
    }),
    tf.layers.dropout({ rate: 0.5 }),
    tf.layers.reLU(),
    tf.layers.dense({
      units: 256,
      inputDim: 512,
    }),
    tf.layers.dropout({ rate: 0.5 }),
    tf.layers.reLU(),
    tf.layers.dense({
      units: 128,
      inputDim: 256,
    }),
    tf.layers.dropout({ rate: 0.5 }),
    tf.layers.reLU(),
    tf.layers.dense({
      units: 1,
      inputDim: 128,
    }),
    tf.layers.activation({
      activation: "sigmoid",
    }),
  ],
});

@injectable()
export class Model implements IModel {
  constructor(@inject(TYPES.ISettings) private settings: ISettings) {}
  async init() {
    try {
      const loadedModel = await tf.loadLayersModel("localstorage://td");
      model = loadedModel;
    } catch {
      console.log("No model saved yet. Starting with a fresh one.");
    }
  }

  predict(encodedData: tf.Tensor): number {
    const result = model.predict(encodedData);
    const values = (result as tf.Tensor).dataSync();
    return Array.from(values)[0];
  }

  train(
    data: tf.Tensor,
    label: tf.Tensor,
    cb: (hist: tf.History) => void
  ): void {
    const loss = (pred: tf.Tensor, label: tf.Tensor) =>
      pred.sub(label).square().mean();
    const learningRate = 0.01;
    const optimizer = tf.train.rmsprop(learningRate);
    model.compile({ optimizer: optimizer, loss: loss });
    model
      .fit(data, label, {
        batchSize: this.settings.chunkSize,
        epochs: this.settings.epochs,
        verbose: 1,
        shuffle: true,
        yieldEvery: "never",
        callbacks: {
          onTrainBegin: () => {
            console.log("Training begin.");
          },
          onBatchBegin: () => {
            console.log("Batch begin.");
          },
          onEpochEnd: () => {
            console.log("Epoch end.");
          },
          onTrainEnd: () => {
            console.log("Training end.");
          },
        },
      })
      .then((hist) => {
        model.save("localstorage://td").then(() => {
          cb(hist);
        });
      })
      .catch((err) => {
        console.error("Training error:", err);
      });
  }
}
