import { Router } from "express";
import TaskController from "../controllers/TaskController";
import AbstractRoutes from "./AbstractRoutes";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import Requests from "../middlewares/Requests";

export default class TaskRoutes extends AbstractRoutes<TaskController> {
  constructor(router: Router, controller: TaskController) {
    super(router, controller);
  }
  initRoutes(): void {
    this.router.use(AuthMiddleware.auth, AuthMiddleware.isRole("admin"));

    this.router
      .route("/:orderId")
      .post(
        Requests.validateTaskCreation(),
        Requests.validateTaskOrderId(),
        Requests.validate,
        (req: any, res: any) => {
          this.controller.createTask(req, res);
        }
      )
      .get(
        Requests.validateTaskOrderId(),
        Requests.validate,
        (req: any, res: any) => {
          this.controller.getTasks(req, res);
        }
      );

    this.router.patch(
      "/complete",
      Requests.validateTaskBulkId(),
      Requests.validate,
      (req: any, res: any) => {
        this.controller.bulkComplete(req, res);
      }
    );

    this.router.patch(
      "/pendiente",
      Requests.validateTaskBulkId(),
      Requests.validate,
      (req: any, res: any) => {
        this.controller.bulkPendiente(req, res);
      }
    );
    this.router
      .route("/:id")
      .put(
        Requests.validateTaskCreation(),
        Requests.validateParamId(),
        Requests.validate,
        (req: any, res: any) => {
          this.controller.updateTask(req, res);
        }
      )
      .delete(
        Requests.validateParamId(),
        Requests.validate,
        (req: any, res: any) => {
          this.controller.deleteTask(req, res);
        }
      );
    this.router.patch(
      "/:id/images",
      Requests.validateParamId(),
      Requests.validateImageArrayCreation(),
      Requests.validate,
      (req: any, res: any) => {
        this.controller.setImages(req, res);
      }
    );
  }
}
