import browser from "webextension-polyfill";
import { injectable } from "inversify";
import { IExtractor } from "./types";
import * as tf from "@tensorflow/tfjs";

@injectable()
class FeatureExtractor203 implements IExtractor {
  private static methods = [
    "GET",
    "POST",
    "OPTIONS",
    "HEAD",
    "PUT",
    "DELETE",
    "SEARCH",
    "PATCH",
  ];

  private static types = [
    "xmlhttprequest",
    "image",
    "font",
    "script",
    "stylesheet",
    "ping",
    "sub_frame",
    "other",
    "main_frame",
    "csp_report",
    "object",
    "media",
  ];

  private generateURLEncoding(url: string) {
    let encoding = [];
    for (let i = 0; i < url.length; i++) {
      encoding.push((url.charCodeAt(i) % 89) + 1);
    }
    if (encoding.length < 200) {
      encoding = new Array(200 - encoding.length).fill(0).concat(encoding);
    } else if (encoding.length > 200) {
      encoding.splice(0, encoding.length - 200);
    }
    return encoding;
  }
  extract(
    details: browser.WebRequest.OnBeforeSendHeadersDetailsType
  ): tf.Tensor {
    let features: number[] = [];
    features = features.concat(this.generateURLEncoding(details.url));
    features.push(FeatureExtractor203.methods.indexOf(details.method) + 1);
    features.push(FeatureExtractor203.types.indexOf(details.type) + 1);
    features.push(details.thirdParty ? 1 : 0);
    const tensor = tf.reshape(tf.tensor(features), [203]);
    return tensor;
  }
}

export { FeatureExtractor203 };
