import browser from "webextension-polyfill";
import { inject, injectable } from "inversify";
import { ICrawler, type ISettings, TYPES } from "./types";

@injectable()
export class Crawler implements ICrawler {
  private window: browser.Windows.Window | undefined;
  private progress: number = 0;
  private dueVisits: number = 0;
  private trainingList: string[] = [];
  private visitDuration: number = 30000; // 30 seconds in milliseconds
  private currentTabs: browser.Tabs.Tab[] = [];

  constructor(@inject(TYPES.ISettings) private settings: ISettings) {}

  start(): void {
    this.trainingList = this.settings.trainingList;
    this.dueVisits = this.trainingList.length;
    browser.extension.isAllowedIncognitoAccess().then((isAllowed) => {
      browser.windows
        .create({ url: "", incognito: isAllowed })
        .then((window) => {
          this.window = window;
          this.openNextWebsite();
        });

      browser.windows.onRemoved.addListener((id) => {
        if (id === this.window?.id) {
          this.window = undefined;
          this.currentTabs = [];
        }
      });
    });
  }

  openNextWebsite() {
    if (this.progress < this.dueVisits && this.window) {
      const url = this.trainingList[this.progress];
      let tabsOpened = 0;

      const openTab = () => {
        if (tabsOpened < this.settings.totalVisits) {
          browser.tabs
            .create({ url: url, windowId: this.window!.id })
            .then((tab) => {
              this.currentTabs.push(tab);
              tabsOpened++;
              openTab(); // Recursively open tabs
            });
        } else {
          // After all tabs are opened, wait for 30 seconds, then close them and open the next set
          setTimeout(() => {
            this.currentTabs.forEach((tab) => {
              browser.tabs.remove(tab.id!);
            });
            this.currentTabs = [];
            this.progress++;
            this.openNextWebsite();
          }, this.visitDuration);
        }
      };

      openTab(); // Start the process of opening tabs
    } else {
      this.stop();
    }
  }

  stop(): void {
    if (this.window && this.window.id) {
      browser.windows.remove(this.window.id!);
      this.window = undefined;
      this.currentTabs = [];
    }
  }

  pause() {
    this.currentTabs.forEach((tab) => {
      browser.tabs.remove(tab.id!);
    });
    this.currentTabs = [];
  }
}
