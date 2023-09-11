import browser from "webextension-polyfill";
import { FiltersEngine, Request } from "@cliqz/adblocker";
import { injectable } from "inversify";
import { ITPLService } from "./types";

@injectable()
class TPLBlockerService implements ITPLService {
  private readonly listUrl: string;
  private engine: FiltersEngine | null = null;
  constructor() {
    this.listUrl = browser.runtime.getURL("tpls/easylist.txt");
    this.engine = null;
  }

  async init(): Promise<void> {
    this.engine = await FiltersEngine.fromLists(fetch, [this.listUrl]);
  }
  classify(
    details: browser.WebRequest.OnBeforeSendHeadersDetailsType
  ): boolean {
    const { match } = this.engine!.match(Request.fromRawDetails(details));
    return match;
  }
}

export { TPLBlockerService };
