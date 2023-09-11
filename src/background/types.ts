import browser from "webextension-polyfill";
export const TYPES = {
  ITPLService: Symbol.for("ITPLService"),
  IApp: Symbol.for("IApp"),
};
export interface ITPLService {
  init(): Promise<void>;
  classify(details: browser.WebRequest.OnBeforeSendHeadersDetailsType): boolean;
}
export interface IApp {
  start(): void;
}
