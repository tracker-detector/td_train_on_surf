import browser from "webextension-polyfill";
import { injectable, inject } from "inversify";
import { IApp, type ITPLService, TYPES } from "./types";

@injectable()
class App implements IApp {
  private static readonly URL_FILTER = { urls: ["http://*/*", "https://*/*"] };
  constructor(@inject(TYPES.ITPLService) private tplService: ITPLService) {}

  start(): void {
    browser.webRequest.onBeforeSendHeaders.addListener(
      (details) => {
        if (this.tplService.classify(details)) {
          console.log("Blocked: ", details);
          return { cancel: true };
        }
      },
      App.URL_FILTER,
      ["requestHeaders", "blocking"]
    );
    console.log("Application Started");
  }
}

export { App };
