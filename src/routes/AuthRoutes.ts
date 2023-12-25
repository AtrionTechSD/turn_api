import { Router } from "express";
import AuthRequest from "../middlewares/AuthRequest";
import AuthMiddleware from "../middlewares/AuthMiddleware";

export default class AuthRoutes {
  private router: Router;
  private controller: any;
  constructor(router: Router, controller: any) {
    this.router = router;
    this.controller = controller;
  }

  public initRoutes() {
    this.router.post(
      "/register",
      AuthRequest.validateAuthRegister(),
      AuthRequest.validate,
      (req: any, res: any, next: any) =>
        this.controller.registerAuth(req, res, next)
    );
    this.router.get("/confirm/:token", (req: any, res: any, next: any) =>
      this.controller.confirmAuth(req, res, next)
    );
    this.router.post(
      "/login",
      AuthRequest.validateAuthLogin(),
      AuthRequest.validate,
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
