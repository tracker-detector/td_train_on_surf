import { create } from "zustand";
import browser from "webextension-polyfill";
type State = {
  currentPage: number;
  setCurrentPage: (value: number) => void;
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
};

const useStore = create<State>((set) => {
  return {
    currentPage: 0,
    setCurrentPage(value) {
      set({ currentPage: value });
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

export default useStore;
