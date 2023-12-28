import { NextFunction, Request, Response, Router } from "express";
import AbstractRoutes from "./AbstractRoutes";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import Requests from "../middlewares/Requests";
import InstituteMiddleware from "../middlewares/InstituteMiddleware";
import InstituteController from "../controllers/InstituteController";

export default class InstituteRoutes extends AbstractRoutes {
  router: Router;
  controller: InstituteController;

  constructor(router: Router, controller: InstituteController) {
    super();
    this.router = router;
    this.controller = controller;
  }

  public initRoutes(): void {
    this.router.use(AuthMiddleware.auth);
    this.router.post(
      "/",

      AuthMiddleware.isRole("admin"),
      Requests.validateInstituteCreate(),
      Requests.validate,
      InstituteMiddleware.isUnique,
      (req: Request, res: Response) => {
        this.controller.createInstitute(req, res);
      }
    );

    this.router.get("/", (req: Request, res: Response) => {
      this.controller.getInstitutes(req, res);
    });
    this.router.get(
      "/:id",

      (req: Request, res: Response) => {
        this.controller.findInstitute(req, res);
      }
    );
    this.router.put(
      "/:id",

      AuthMiddleware.isRole("admin"),
      Requests.validateInstituteCreate(),
      Requests.validate,
      (req: Request, res: Response) => {
        this.controller.updateInstitute(req, res);
      }
    );
    this.router.delete(
      "/:id",

      AuthMiddleware.isRole("admin"),
      (req: Request, res: Response) => {
        this.controller.deleteInstitute(req, res);
      }
    );
  }
}
