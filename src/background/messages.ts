import { type ICrawler, IMessages, TYPES } from "./types";
import { Message } from "../events/events";
import { inject, injectable } from "inversify";
import browser from "webextension-polyfill";
@injectable()
export class Messages implements IMessages {
  constructor(@inject(TYPES.ICrawler) private crawler: ICrawler) {}
  private handlers: { [key: string]: () => void } = {
    startCrawl: this.handleStartCrawl.bind(this),
    stopCrawl: this.handleStopCrawl.bind(this),
    endCrawl: this.handleEndCrawl.bind(this),
  };

  private handleStartCrawl() {
    console.log("received start message");
    this.crawler.start();
  }

  private handleStopCrawl() {
    this.crawler.pause();
  }

  private handleEndCrawl() {
    this.crawler.stop();
  }

  listen() {
    browser.runtime.onMessage.addListener((message: Message) => {
      const handler = this.handlers[message.type];
      if (handler) {
        handler();
      } else {
        console.warn("Unhandled message type:", message.type);
      }
    });
  }
}
