import { Router } from "express";
import AbstractRoutes from "./AbstractRoutes";
import ProfileController from "../controllers/ProfileController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import Requests from "../middlewares/Requests";

export default class ProfileRoutes extends AbstractRoutes {
  router: Router;
  controller: ProfileController;
  constructor(router: Router, controller: ProfileController) {
    super();
    this.router = router;
    this.controller = controller;
  }

  initRoutes(): void {
    this.router.use(AuthMiddleware.auth);
    /* The code block is defining the routes for the "/profile" endpoint. It's responsible
    of handling creation, updating and retrievieng user profile */
    this.router
      .route("/")
      .post(
        Requests.validateProfileCreate(),
        Requests.validate,
        (req: any, res: any) => {
          this.controller.createProfile(req, res);
        }
      )
      .put(
        Requests.validateProfileCreate(),
        Requests.validate,
        (req: any, res: any) => {
          this.controller.createProfile(req, res);
        }
      )
      .get((req: any, res: any) => {
        this.controller.findProfile(req, res);
      });
  }
}
