import config from "./app.config";
import { App } from "./src/AppInit";
import { AuthController } from "./src/controllers/AuthController";
import InstituteController from "./src/controllers/InstituteController";
import UserController from "./src/controllers/UserController";
const PORT = config.app.port;

const controllers = [
  new AuthController(),
  new UserController(),
  new InstituteController(),
];

const app = new App(controllers, PORT);

export default app;
app.listen();
