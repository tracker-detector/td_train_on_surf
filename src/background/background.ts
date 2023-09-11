import browser from "webextension-polyfill";
import { Blocker } from "./blocker";

const blocker = new Blocker();
blocker.init();
if (browser.webRequest) {
  const urlFilter = { urls: ["http://*/*", "https://*/*"] };

  browser.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      if (blocker.ready) {
        if (blocker.classify(details)) {
          console.log("Blocked: ", details);
          return { cancel: true };
        }
      }
    },
    urlFilter,
    ["requestHeaders", "extraHeaders", "blocking"]
  );
} else {
  console.error("webRequest API is not available");
}
