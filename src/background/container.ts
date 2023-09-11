import "reflect-metadata";
import { Container } from "inversify";
import { type IApp, type ITPLService, TYPES } from "./types";
import { TPLBlockerService } from "./blocker";
import { App } from "./app";

const container = new Container();
container
  .bind<ITPLService>(TYPES.ITPLService)
  .to(TPLBlockerService)
  .inSingletonScope();
container.bind<IApp>(TYPES.IApp).to(App);

export { container };
