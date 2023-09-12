import "reflect-metadata";
import { Container } from "inversify";
import {
  type IApp,
  type ITPLService,
  TYPES,
  IModel,
  IExtractor,
  IAsyncQueue,
} from "./types";
import { TPLBlockerService } from "./blocker";
import { App } from "./app";
import { Model } from "./model";
import { FeatureExtractor203 } from "./featureExtractor";
import { AsyncQueue } from "./asyncQueue";

const container = new Container();
container
  .bind<ITPLService>(TYPES.ITPLService)
  .to(TPLBlockerService)
  .inSingletonScope();
container.bind<IModel>(TYPES.IModel).to(Model).inSingletonScope();
container
  .bind<IExtractor>(TYPES.IExtractor)
  .to(FeatureExtractor203)
  .inSingletonScope();
container
  .bind<IAsyncQueue>(TYPES.IAsyncQueue)
  .to(AsyncQueue)
  .inSingletonScope();
container.bind<IApp>(TYPES.IApp).to(App);

export { container };
