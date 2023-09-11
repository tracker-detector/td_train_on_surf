import browser from "webextension-polyfill";
import { FiltersEngine, Request } from "@cliqz/adblocker";
class Blocker {
  private readonly listUrl: string;
  private engine: FiltersEngine | null = null;
  private isReady: boolean = false;
  constructor() {
    this.listUrl = browser.runtime.getURL("tpls/easylist.txt");
    this.engine = null;
  }
  public init() {
    FiltersEngine.fromLists(fetch, [this.listUrl]).then((engine) => {
      this.engine = engine;
      this.isReady = true;
    });
  }
  public get ready(): boolean {
    return this.isReady;
  }
  public classify(
    details: browser.WebRequest.OnBeforeSendHeadersDetailsType
  ): boolean {
    const { match } = this.engine!.match(Request.fromRawDetails(details));
    return match;
  }
}

export { Blocker };
