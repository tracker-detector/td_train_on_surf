import browser from "webextension-polyfill";

if (browser.webRequest) {
  const urlFilter = { urls: ["http://*/*", "https://*/*"] };

  browser.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      console.log(details);
    },
    urlFilter,
    ["requestHeaders", "extraHeaders", "blocking"]
  );
} else {
  console.error("webRequest API is not available");
}
