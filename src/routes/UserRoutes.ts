import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import AbstractRoutes from "./AbstractRoutes";
import Requests from "../middlewares/Requests";
import UserController from "../controllers/UserController";

export default class UserRoutes extends AbstractRoutes<UserController> {
  constructor(router: Router, controller: UserController) {
    super(router, controller);
  }

  public initRoutes() {
    this.router.use(AuthMiddleware.auth, AuthMiddleware.isRole("admin"));
    this.router.get("/", (req, res) => {
      this.controller.getUsers(req, res);
    });

    this.router.get("/:id", (req, res) => {
      this.controller.findUser(req, res);
    });

    this.router.post(
      "/",
      AuthMiddleware.isUniqueEmail("user"),
      Requests.validateUserCreate(),
      Requests.validate,
      (req: any, res: any) => {
        this.controller.createUser(req, res);
      }
    );

    this.router.put(
      "/:id",
      Requests.validateUserCreate(),
      Requests.validate,
      (req: any, res: any) => {
        this.controller.updateUser(req, res);
      }
    );

    /* This method is responsible for handling the logic of deleting a user from
   the system. */
    this.router.delete("/restore/:id", (req: any, res: any) => {
      this.controller.restoreUser(req, res);
    });
    this.router.delete("/:id", (req: any, res: any) => {
      this.controller.deleteUser(req, res);
    });
  }
}
