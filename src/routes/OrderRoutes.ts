import { Router } from "express";
import AbstractRoutes from "./AbstractRoutes";
import OrderController from "../controllers/OrderController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import Requests from "../middlewares/Requests";

export default class OrderRoutes extends AbstractRoutes<OrderController> {
  constructor(router: Router, controller: OrderController) {
    super(router, controller);
  }

  initRoutes(): void {
    this.router.use(AuthMiddleware.auth), AuthMiddleware.isRole("admin");
    this.router
      .route("/")
      .post(
        Requests.validateOrderCreation(),
        Requests.validateTaskCreation(),
        Requests.validate,
        (req: any, res: any) => {
          this.controller.createOrder(req, res);
        }
      )
      .get((req: any, res: any) => {
        this.controller.getOrders(req, res);
      });
    this.router
      .route("/:id")
      .put(
        Requests.validateOrderCreation(),
        Requests.validate,
        (req: any, res: any) => {
          this.controller.updateOrder(req, res);
        }
      )
      .patch(
        Requests.validateOrderStatus(),
        Requests.validate,
        (req: any, res: any) => {
          this.controller.changeStatus(req, res);
        }
      )
      .delete((req: any, res: any) => {
        this.controller.deleteOrders(req, res);
      })
      .get((req: any, res: any) => {
        this.controller.findOrders(req, res);
      });
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
