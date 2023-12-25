import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import UserRequest from "../middlewares/UserRequest";

export default class UserRoutes {
  private router: Router;
  private controller: any;
  constructor(router: Router, controller: any) {
    this.router = router;
    this.controller = controller;
  }

  public initRoutes() {
    this.router.get(
      "/",
      AuthMiddleware.auth,
      AuthMiddleware.isRole("admin"),
      (req, res, next) => {
        this.controller.getUsers(req, res, next);
      }
    );
    this.router.get(
      "/:id",

      (req, res, next) => {
        this.controller.findUser(req, res, next);
      }
    );
    this.router.post(
      "/",
      AuthMiddleware.auth,
      AuthMiddleware.isRole("admin"),
      UserRequest.validateUserCreate(),
      UserRequest.validate,
      (req: any, res: any, next: any) => {
        this.controller.createUser(req, res, next);
      }
    );

    this.router.put(
      "/:id",
      AuthMiddleware.auth,
      AuthMiddleware.isRole("admin"),
      UserRequest.validateUserCreate(),
      UserRequest.validate,
      (req: any, res: any, next: any) => {
        this.controller.updateUser(req, res, next);
      }
    );

    this.router.delete(
      "/:id",
      AuthMiddleware.auth,
      AuthMiddleware.isRole("admin"),
      (req: any, res: any, next: any) => {
        this.controller.deleteUser(req, res, next);
      }
    );
  }
}
