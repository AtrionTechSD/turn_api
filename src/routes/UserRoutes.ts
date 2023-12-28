import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import AbstractRoutes from "./AbstractRoutes";
import Requests from "../middlewares/Requests";
import UserController from "../controllers/UserController";

export default class UserRoutes extends AbstractRoutes {
  router: Router;
  controller: UserController;

  constructor(router: Router, controller: UserController) {
    super();
    this.router = router;
    this.controller = controller;
  }

  public initRoutes() {
    this.router.use(AuthMiddleware.auth, AuthMiddleware.isRole("admin"));

    /* This method is responsible for handling the logic of
   retrieving and returning a list of users. */
    this.router.get("/", (req, res, next) => {
      this.controller.getUsers(req, res, next);
    });

    /* This method is responsible for handling the logic for 
    retrieving a specific user by its ID. */
    this.router.get("/:id", (req, res, next) => {
      this.controller.findUser(req, res, next);
    });

    /* The code  is defining a POST route for creating a new user. */
    this.router.post(
      "/",
      Requests.validateUserCreate(),
      Requests.validate,
      (req: any, res: any, next: any) => {
        this.controller.createUser(req, res, next);
      }
    );

    /* The code is defining a PUT route for updating a user with a specific ID. */
    this.router.put(
      "/:id",
      Requests.validateUserCreate(),
      Requests.validate,
      (req: any, res: any, next: any) => {
        this.controller.updateUser(req, res, next);
      }
    );

    /* This method is responsible for handling the logic of deleting a user from
   the system. */
    this.router.delete("/:id", (req: any, res: any, next: any) => {
      this.controller.deleteUser(req, res, next);
    });
  }
}
