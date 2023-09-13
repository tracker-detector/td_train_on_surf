import { inject, injectable } from "inversify";
import { type ISettings, IStats, TYPES } from "./types";
import { WebRequest } from "webextension-polyfill";
import browser from "webextension-polyfill";

type TabStore = {
  [key: number]: LabeledRequest[];
};
type MetricsStore = {
  [key: number]: Metrics;
};

type Metrics = {
  mse: number;
  totalTracker: number;
  identifiedTracker: number;
  totalNonTracker: number;
  identifiedNonTracker: number;
};

type MetricsHistory = {
  [key: number]: Metrics[];
};

type LabeledRequest = WebRequest.OnBeforeSendHeadersDetailsType & {
  tplLabel: boolean;
  predictValue: number;
};

@injectable()
export class Stats implements IStats {
  private store: TabStore = {};
  private metrics: MetricsStore = {};
  private metricsHistory: MetricsHistory = {};
  private metricsHistoryThreshold = 10;

  constructor(@inject(TYPES.ISettings) private settings: ISettings) {
    // Removes the tab when reloading
    browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (changeInfo.status === "loading") {
        delete this.store[tabId];
        if (!this.metricsHistory[tabId]) {
          this.metricsHistory[tabId] = [];
        }
        while (
          this.metricsHistory[tabId].length >= this.metricsHistoryThreshold
        ) {
          this.metricsHistory[tabId].shift();
        }
        this.metricsHistory[tabId].push(this.metrics[tabId]);
        delete this.metrics[tabId];
      }
    });
    // Removes data of tabs that are closed
    browser.tabs.onRemoved.addListener((tabId) => {
      delete this.store[tabId];
      delete this.metrics[tabId];
      delete this.metricsHistory[tabId];
    });
    // Updates metrics every 200ms
    setInterval(() => {
      if (!this.settings.currentTab || this.settings.currentTab.id == undefined)
        return;
      browser.storage.local.set({
        history: this.metricsHistory[this.settings.currentTab.id],
        metrics: this.metrics[this.settings.currentTab.id],
        requests: this.store[this.settings.currentTab.id],
      });
    }, 200);
  }

  addRequests(
    details: WebRequest.OnBeforeSendHeadersDetailsType,
    label: boolean,
    predict: number
  ): void {
    if (!this.store[details.tabId]) {
      this.store[details.tabId] = [];
    }
    this.store[details.tabId].push({
      ...details,
      tplLabel: label,
      predictValue: predict,
    });
    this.calculateMetrics();
  }
  private calculateMetrics() {
    this.metrics = {};
    Object.keys(this.store).map((tabId) => {
      const requests = this.store[parseInt(tabId)];
      const metrics = {
        mse: this.calculateMse(requests),
        totalNonTracker: this.calculateTotalNonTracker(requests),
        totalTracker: this.calculateTotalTracker(requests),
        identifiedNonTracker:
          this.calculateCorrectlyIdentifiedNonTrackers(requests),
        identifiedTracker: this.calculateCorrectlyIdentifiedTrackers(requests),
      };
      this.metrics[parseInt(tabId)] = metrics;
    });
  }
  private calculateMse(requests: LabeledRequest[]): number {
    const prediction: number[] = requests.map((x) => x.predictValue);
    const actual: number[] = requests.map((x) => (x.tplLabel ? 1 : 0));
    let sumOfSquares = 0;

    for (let i = 0; i < prediction.length; i++) {
      const error = prediction[i] - actual[i];
      sumOfSquares += error * error;
    }

    return sumOfSquares / prediction.length;
  }
  private calculateTotalTracker(requests: LabeledRequest[]): number {
    return requests.filter((x) => x.tplLabel).length;
  }
  private calculateTotalNonTracker(requests: LabeledRequest[]): number {
    return requests.filter((x) => !x.tplLabel).length;
  }
  private calculateCorrectlyIdentifiedTrackers(
    requests: LabeledRequest[]
  ): number {
    return requests.filter(
      (x) => x.tplLabel && this.settings.blockingRate <= x.predictValue
    ).length;
  }
  private calculateCorrectlyIdentifiedNonTrackers(
    requests: LabeledRequest[]
  ): number {
    return requests.filter(
      (x) => !x.tplLabel && this.settings.blockingRate > x.predictValue
    ).length;
  }
}
