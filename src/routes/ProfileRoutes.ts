import { Router } from "express";
import AbstractRoutes from "./AbstractRoutes";
import ProfileController from "../controllers/ProfileController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import Requests from "../middlewares/Requests";

export default class ProfileRoutes extends AbstractRoutes<ProfileController> {
  constructor(router: Router, controller: ProfileController) {
    super(router, controller);
  }

  initRoutes(): void {
    this.router.use(AuthMiddleware.auth);
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

    this.router.post(
      "/image",
      Requests.validateImageCreation(),
      Requests.validate,
      (req: any, res: any) => {
        this.controller.setProfileImage(req, res);
      }
    );
  }
}
