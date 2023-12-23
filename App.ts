import config from "./app.config";
import { App } from "./src/AppInit";
import { AuthController } from "./src/controllers/AuthController";
const PORT = config.app.port;

const controllers = [new AuthController()];

const app = new App(controllers, PORT);

export default app;
app.listen();
