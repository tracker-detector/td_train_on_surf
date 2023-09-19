import { injectable } from "inversify";
import { ISettings } from "./types";
import browser from "webextension-polyfill";
@injectable()
export class Settings implements ISettings {
  private _chunkSize = 512;
  private _epochs = 7;
  private _windowSize = 512;
  private _blockingRate = 0.8;
  private _modelActive = false;
  private _blockingActive = true;
  private _currentTab: undefined | browser.Tabs.Tab;

  constructor() {
    browser.storage.local.get().then((value) => {
      this._chunkSize = value.chunkSize || this._chunkSize;
      this._epochs = value.epochs || this._epochs;
      this._windowSize = value.windowSize || this._windowSize;
      this._blockingRate = value.blockingRate || this._blockingRate;
      this._modelActive = value.modelActive || this._modelActive;
      this._blockingActive =
        value.blockingActive === undefined
          ? this._blockingActive
          : value.blockingActive;
      browser.storage.local.set({
        chunkSize: this._chunkSize,
        epochs: this._epochs,
        windowSize: this._windowSize,
        blockingRate: this._blockingRate,
        modelActive: this._modelActive,
        blockingActive: this._blockingActive,
      });
    });
    // updates settings data
    setInterval(() => {
      browser.storage.local.get().then((value) => {
        this._chunkSize = value.chunkSize;
        this._epochs = value.epochs;
        this._windowSize = value.windowSize;
        this._blockingRate = value.blockingRate;
        this._modelActive = value.modelActive ? true : false;
        this._blockingActive = value.blockingActive ? true : false;
      });
    }, 400);
    // gets and stores current tab
    setInterval(
      () =>
        browser.tabs
          .query({ currentWindow: true, lastFocusedWindow: true, active: true })
          .then((tab) => {
            if (tab.length == 0) {
              return;
            }
            this._currentTab = tab[0];
            browser.storage.local.set({ currentTab: this._currentTab });
          }),
      200
    );
  }
  get currentTab(): browser.Tabs.Tab | undefined {
    return this._currentTab;
  }
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
}
