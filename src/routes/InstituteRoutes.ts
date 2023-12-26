import { NextFunction, Request, Response, Router } from "express";
import AbstractRoutes from "./AbstractRoutes";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import Requests from "../middlewares/Requests";
import InstituteMiddleware from "../middlewares/InstituteMiddleware";

export default class InstituteRoutes extends AbstractRoutes {
  router: Router;
  controller: any;

  constructor(router: Router, controller: any) {
    super();
    this.router = router;
    this.controller = controller;
  }

  public initRoutes(): void {
    this.router.post(
      "/",
      AuthMiddleware.auth,
      AuthMiddleware.isRole("admin"),
      Requests.validateInstituteCreate(),
      Requests.validate,
      InstituteMiddleware.isUnique,
      (req: Request, res: Response, next: NextFunction) => {
        this.controller.createInstitute(req, res, next);
      }
    );

    this.router.get(
      "/",
      AuthMiddleware.auth,
      (req: Request, res: Response, next: NextFunction) => {
        this.controller.getInstitutes(req, res, next);
      }
    );
    this.router.get(
      "/:id",
      AuthMiddleware.auth,
      (req: Request, res: Response, next: NextFunction) => {
        this.controller.findInstitute(req, res, next);
      }
    );
  }
}
