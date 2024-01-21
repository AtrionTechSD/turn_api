import { Router } from "express";
import AbstractRoutes from "./AbstractRoutes";
import CareerController from "../controllers/CareerController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import Requests from "../middlewares/Requests";
import CareerMiddleware from "../middlewares/CareerMiddleware";

export default class CareerRoutes extends AbstractRoutes<CareerController> {
  constructor(router: Router, controller: CareerController) {
    super(router, controller);
  }

  initRoutes(): void {
    this.router.use(AuthMiddleware.auth);
    this.router
      .route("/")
      .post(
        AuthMiddleware.isRole("admin"),
        Requests.validateCareerCreation(),
        Requests.validate,
        CareerMiddleware.isUnique,
        (req: any, res: any) => {
          this.controller.createCareer(req, res);
        }
      )
      .get((req: any, res: any) => {
        this.controller.getCareers(req, res);
      });

    this.router
      .route("/:id")
      .put(
        AuthMiddleware.isRole("admin"),
        Requests.validateCareerCreation(),
        Requests.validate,
        (req: any, res: any) => {
          this.controller.updateCareer(req, res);
        }
      )
      .get((req: any, res: any) => {
        this.controller.findCareer(req, res);
      })
      .delete(AuthMiddleware.isRole("admin"), (req: any, res: any) => {
        this.controller.deleteCareer(req, res);
      });
  }
}
