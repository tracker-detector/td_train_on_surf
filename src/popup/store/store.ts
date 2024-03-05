import { create } from "zustand";
import browser from "webextension-polyfill";

type Metrics = {
  mse: number;
  totalTracker: number;
  identifiedTracker: number;
  totalNonTracker: number;
  identifiedNonTracker: number;
};

type LabeledRequest = browser.WebRequest.OnBeforeSendHeadersDetailsType & {
  tplLabel: boolean;
  predictValue: number;
};
type State = {
  currentPage: number;
  setCurrentPage: (value: number) => void;
  outputUrl: string;
  setOutputUrl: (value: string) => void;
  currentTab: browser.Tabs.Tab | undefined;
  setCurrentTab: (value: browser.Tabs.Tab) => void;
  blockingActive: boolean;
  setBlockingActive: (value: boolean) => void;
  modelActive: boolean;
  setModelActive: (value: boolean) => void;
  chunkSize: number;
  setChunkSize: (value: number) => void;
  epochs: number;
  setEpochs: (value: number) => void;
  windowSize: number;
  setWindowSize: (value: number) => void;
  blockingRate: number;
  setBlockingRate: (value: number) => void;
  stats: Metrics | undefined;
  setStats: (value: Metrics) => void;
  history: Metrics[];
  setHistory: (value: Metrics[]) => void;
  requests: LabeledRequest[];
  setRequests: (value: LabeledRequest[]) => void;
  seenRequests: number;
  setSeenRequests: (value: number) => void;
  trainingRuns: number;
  setTrainingRuns: (value: number) => void;
  latestLoss: number;
  setLatestLoss: (value: number) => void;
  trainingList: string[];
  setTrainingList: (value: string[]) => void;
};

const useStore = create<State>((set) => {
  return {
    currentPage: 0,
    setCurrentPage(value) {
      set({ currentPage: value });
    },
    outputUrl: "http://localhost:3000/models/tos",
    setOutputUrl(value) {
      set({ outputUrl: value });
      browser.storage.local.set({ outputUrl: value });
    },
    currentTab: undefined,
    setCurrentTab(value) {
      set({ currentTab: value });
    },
    blockingActive: true,
    setBlockingActive(value) {
      set({ blockingActive: value });
      browser.storage.local.set({ blockingActive: value });
    },
    modelActive: false,
    setModelActive(value) {
      set({ modelActive: value });
      browser.storage.local.set({ modelActive: value });
    },
    chunkSize: 512,
    setChunkSize(value) {
      set({ chunkSize: value });
      browser.storage.local.set({ chunkSize: value });
    },
    epochs: 7,
    setEpochs(value) {
      set({ epochs: value });
      browser.storage.local.set({ epochs: value });
    },
    windowSize: 512,
    setWindowSize(value) {
      set({ windowSize: value });
      browser.storage.local.set({ windowSize: value });
    },
    blockingRate: 0.8,
    setBlockingRate(value) {
      set({ blockingRate: value });
      browser.storage.local.set({ blockingRate: value });
    },
    stats: undefined,
    setStats(value) {
      set({ stats: value });
    },
    history: [],
    setHistory(value) {
      set({ history: value });
    },
    requests: [],
    setRequests(value) {
      set({ requests: value });
    },
    latestLoss: 1,
    setLatestLoss(value) {
      set({ latestLoss: value });
    },
    seenRequests: 0,
    setSeenRequests(value) {
      set({ seenRequests: value });
    },
    trainingRuns: 0,
    setTrainingRuns(value) {
      set({ trainingRuns: value });
    },
    trainingList: [],
    setTrainingList(value) {
      set({ trainingList: value });
    },
  };
});

browser.storage.local.get().then((value) => {
  useStore.setState({
    blockingActive: value.blockingActive,
    modelActive: value.modelActive,
    chunkSize: value.chunkSize,
    epochs: value.epochs,
    windowSize: value.windowSize,
    blockingRate: value.blockingRate,
    trainingList: value.trainingList,
    outputUrl: value.outputUrl,
  });
});
// Updates values that get can be changed by background
setInterval(() => {
  browser.storage.local.get("currentTab").then((value) => {
    useStore.setState({
      currentTab: value.currentTab as browser.Tabs.Tab,
    });
  });
  browser.storage.local.get("metrics").then((value) => {
    useStore.setState({
      stats: value.metrics as Metrics,
    });
  });
  browser.storage.local.get("history").then((value) => {
    useStore.setState({
      history: value.history as Metrics[],
    });
  });
  browser.storage.local.get("requests").then((value) => {
    useStore.setState({
      requests: value.requests as LabeledRequest[],
    });
  });
  browser.storage.local.get("latestLoss").then((value) => {
    useStore.setState({
      latestLoss: value.latestLoss as number,
    });
  });
  browser.storage.local.get("seenRequests").then((value) => {
    useStore.setState({
      seenRequests: value.seenRequests as number,
    });
  });
  browser.storage.local.get("trainingRuns").then((value) => {
    useStore.setState({
      trainingRuns: value.trainingRuns as number,
    });
  });
}, 200);

export default useStore;
