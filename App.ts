import config from "./app.config";
import { App } from "./src/AppInit";
import { AuthController } from "./src/controllers/AuthController";
import InstituteController from "./src/controllers/InstituteController";
import ProfileController from "./src/controllers/ProfileController";
import UserController from "./src/controllers/UserController";
import response from "./src/utils/response";
const PORT = config.app.port;

const controllers = [
  new AuthController(),
  new UserController(),
  new InstituteController(),
  new ProfileController(),
];

const app = new App(controllers, PORT);
app.app.use("/api/*", (req: any, res: any) => {
  response.error(res, 404, "Not Found");
});
export default app;
app.listen();
