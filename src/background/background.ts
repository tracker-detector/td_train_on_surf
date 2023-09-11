import { container } from "./container";
import { IApp, ITPLService, TYPES } from "./types";

const tplService = container.get<ITPLService>(TYPES.ITPLService);
tplService.init().then(() => {
  container.get<IApp>(TYPES.IApp).start();
});
