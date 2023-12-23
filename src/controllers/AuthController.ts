import { NextFunction, Request, Response, Router } from "express";
import { AuthService } from "../services/AuthService";
import response from "../utils/response";
import IController from "./IController";
import Requests from "../middlewares/Requests";
import path from "path";
import config from "../../app.config";
import AuthMiddleware from "../middlewares/AuthMiddleware";

export class AuthController implements IController {
  private authService: AuthService;
  public prefix: string = "auth";
  public router: Router = Router();
  constructor() {
    this.authService = new AuthService();
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.post(
      "/register",
      Requests.validateAuthRegister(),
      Requests.validate,
      (req: any, res: any, next: any) => this.registerAuth(req, res, next)
    );
    this.router.get("/confirm/:token", (req: any, res: any, next: any) =>
      this.confirmAuth(req, res, next)
    );
    this.router.post(
      "/login",
      Requests.validateAuthLogin(),
      Requests.validate,
      (req: any, res: any, next: any) => this.loginAuth(req, res, next)
    );
  }

  async registerAuth(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.setAuth(req.body);
      response.success(res, 201, "Cuenta creada exitosamente");
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }

  async confirmAuth(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.confirmAuth(req.params.token);
      const confirmed = path.join(config.app.views, "confirmed.html");
      res.sendFile(confirmed);
    } catch (error: any) {
      const errorConfirmation = path.join(
        config.app.views,
        "errorConfirmation.html"
      );
      res.status(422).sendFile(errorConfirmation);
    }
  }

  async loginAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = await this.authService.login(req.body, res);
      console.log(res);
      response.success(res, 200, auth);
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }
}
