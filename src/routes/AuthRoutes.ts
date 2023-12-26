import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import AbstractRoutes from "./AbstractRoutes";
import Requests from "../middlewares/Requests";

export default class AuthRoutes extends AbstractRoutes {
  router: Router;
  controller: any;
  constructor(router: Router, controller: any) {
    super();
    this.router = router;
    this.controller = controller;
  }

  public initRoutes() {
    this.router.post(
      "/register",
      Requests.validateAuthRegister(),
      Requests.validate,
      (req: any, res: any, next: any) =>
        this.controller.registerAuth(req, res, next)
    );
    this.router.get("/confirm/:token", (req: any, res: any, next: any) =>
      this.controller.confirmAuth(req, res, next)
    );
    this.router.post(
      "/login",
      Requests.validateAuthLogin(),
      Requests.validate,
      (req: any, res: any, next: any) =>
        this.controller.loginAuth(req, res, next)
    );
    this.router.post(
      "/logout",
      AuthMiddleware.auth,
      (req: any, res: any, next: any) =>
        this.controller.logoutAuth(req, res, next)
    );
    this.router.post(
      "/logout/all",
      AuthMiddleware.auth,
      (req: any, res: any, next: any) =>
        this.controller.logoutAllAuth(req, res, next)
    );
  }
}
