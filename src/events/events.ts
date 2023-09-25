export interface Message {
  type: string;
}
export interface StartCrawl extends Message {
  type: "startCrawl";
}

export interface StopCrawl extends Message {
  type: "stopCrawl";
}

export interface EndCrawl extends Message {
  type: "endCrawl";
}
