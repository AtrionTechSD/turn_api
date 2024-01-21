import { NextFunction, Request, Response, Router } from "express";
import AbstractRoutes from "./AbstractRoutes";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import Requests from "../middlewares/Requests";
import InstituteMiddleware from "../middlewares/InstituteMiddleware";
import InstituteController from "../controllers/InstituteController";

export default class InstituteRoutes extends AbstractRoutes<InstituteController> {
  constructor(router: Router, controller: InstituteController) {
    super(router, controller);
  }

  public initRoutes(): void {
    this.router.use(AuthMiddleware.auth);

    this.router
      .route("/")
      .post(
        AuthMiddleware.isRole("admin"),
        Requests.validateInstituteCreate(),
        Requests.validate,
        InstituteMiddleware.isUnique,
        (req: Request, res: Response) => {
          this.controller.createInstitute(req, res);
        }
      )
      .get((req: Request, res: Response) => {
        this.controller.getInstitutes(req, res);
      });

    this.router
      .route("/:id")
      .get((req: Request, res: Response) => {
        this.controller.findInstitute(req, res);
      })
      .put(
        AuthMiddleware.isRole("admin"),
        Requests.validateInstituteCreate(),
        Requests.validate,
        (req: Request, res: Response) => {
          this.controller.updateInstitute(req, res);
        }
      )
      .delete(AuthMiddleware.isRole("admin"), (req: Request, res: Response) => {
        this.controller.deleteInstitute(req, res);
      });
    this.router.patch(
      "/:id/logo",
      Requests.validateImageCreation(),
      Requests.validate,
      AuthMiddleware.isRole("admin"),
      (req: any, res: any) => {
        this.controller.setLogo(req, res);
      }
    );
  }
}
