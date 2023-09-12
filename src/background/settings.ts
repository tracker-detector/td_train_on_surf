import { injectable } from "inversify";
import { ISettings } from "./types";

@injectable()
export class Settings implements ISettings {
  private readonly _chunkSize = 512;
  private readonly _epochs = 7;
  private readonly _windowSize = 512;
  private readonly _blockingRate = 0.8;
  private readonly _modelActive = false;
  private readonly _blockingActive = true;

  get chunkSize(): number {
    return this._chunkSize;
  }
  get epochs(): number {
    return this._epochs;
  }
  get windowSize(): number {
    return this._windowSize;
  }
  get blockingRate(): number {
    return this._blockingRate;
  }
  get modelActive(): boolean {
    return this._modelActive;
  }
  get blockingActive(): boolean {
    return this._blockingActive;
  }
  updateTrainingHist(lastEpochAcc: number): void {
    console.log(lastEpochAcc);
  }
}
