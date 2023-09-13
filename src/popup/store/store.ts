import { create } from "zustand";
import browser from "webextension-polyfill";

type Metrics = {
  mse: number;
  totalTracker: number;
  identifiedTracker: number;
  totalNonTracker: number;
  identifiedNonTracker: number;
};
type State = {
  currentPage: number;
  setCurrentPage: (value: number) => void;
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
  history: Metrics[] | undefined;
  setHistory: (value: Metrics[]) => void;
};

const useStore = create<State>((set) => {
  return {
    currentPage: 0,
    setCurrentPage(value) {
      set({ currentPage: value });
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
    history: undefined,
    setHistory(value) {
      set({ history: value });
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
}, 200);

export default useStore;
