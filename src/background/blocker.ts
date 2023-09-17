import browser from "webextension-polyfill";
import { FiltersEngine, Request } from "@cliqz/adblocker";
import { injectable } from "inversify";
import { ITPLService } from "./types";

@injectable()
class TPLBlockerService implements ITPLService {
  private readonly listUrl: string[];
  private engine: FiltersEngine | null = null;
  constructor() {
    this.listUrl = [
      "https://easylist.to/easylist/easylist.txt",
      "https://secure.fanboy.co.nz/fanboy-cookiemonster.txt",
      "https://secure.fanboy.co.nz/fanboy-annoyance.txt",
      "https://easylist.to/easylist/easyprivacy.txt",
      "https://easylist.to/easylistgermany/easylistgermany.txt",
      "https://easylist-downloads.adblockplus.org/fanboy-notifications.txt",
    ];
    this.engine = null;
  }

  async init(): Promise<void> {
    this.engine = await FiltersEngine.fromLists(fetch, this.listUrl);
  }
  classify(
    details: browser.WebRequest.OnBeforeSendHeadersDetailsType
  ): boolean {
    const { match } = this.engine!.match(Request.fromRawDetails(details));
    return match;
  }
}

export { TPLBlockerService };
