import config from "./app.config";
import { App } from "./src/AppInit";
import AppController from "./src/controllers/AppController";
import { AuthController } from "./src/controllers/AuthController";
import CareerController from "./src/controllers/CareerController";
import InstituteController from "./src/controllers/InstituteController";
import OrderController from "./src/controllers/OrderController";
import ProfileController from "./src/controllers/ProfileController";
import TaskController from "./src/controllers/TaskController";
import UserController from "./src/controllers/UserController";
import Relation from "./src/models/Relations";
import response from "./src/utils/response";
const PORT = config.app.port;

const controllers = [
  new AuthController(),
  new UserController(),
  new InstituteController(),
  new ProfileController(),
  new AppController(),
  new CareerController(),
  new OrderController(),
  new TaskController(),
];

const app = new App(controllers, PORT);
Relation.initRelations();

app.app.use("/api/*", (req: any, res: any) => {
  response.error(res, 404, "Not Found");
});
export default app;
app.listen();
