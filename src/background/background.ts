import { container } from "./container";
import { IApp, IModel, ITPLService, TYPES } from "./types";

const tplService = container.get<ITPLService>(TYPES.ITPLService);
const model = container.get<IModel>(TYPES.IModel);
Promise.all([tplService.init(), model.init()]).then(() => {
  container.get<IApp>(TYPES.IApp).start();
});
