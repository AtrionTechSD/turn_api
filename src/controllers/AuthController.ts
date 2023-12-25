import { NextFunction, Request, Response, Router } from "express";
import { AuthService } from "../services/AuthService";
import response from "../utils/response";
import IController from "./IController";
import path from "path";
import config from "../../app.config";
import AuthRoutes from "../routes/AuthRoutes";

export class AuthController implements IController {
  private authService: AuthService = new AuthService();
  public prefix: string = "auth";
  public router: Router = Router();
  constructor() {
    new AuthRoutes(this.router, this).initRoutes();
  }

  /**
   * The `initRoutes` function sets up the routes for registering, confirming, logging in, logging out,


  /**
   * Handles the registration of a new user  authentication, and it returns a success response i.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async registerAuth(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.createAuth(req.body);
      response.success(res, 201, "Cuenta creada exitosamente");
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }

  /**
   *Handles the confirmation of user authentication by checking a token, and sends a response accordingly.
   * @param {Request} req
   * @param {Response} res -
   * @param {NextFunction} next -
   */
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

  /**
   * Handles the authentication process foruser login.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async loginAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = await this.authService.login(req.body, res);
      response.success(res, 200, auth);
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }

  /**
   * The function logs out the user from the authentication system and sends a success response.
   * @param {any} req -
   * @param {Response} res -
   * @param {NextFunction} next
   */
  async logoutAuth(req: any, res: Response, next: NextFunction) {
    await this.authService.logout(res);
    response.success(res, 200, "Sesión cerrada exitosamente");
  }

  /**
   * The function logs out all authenticated sessions and returns a success message if successful, or
   * an error message if there was an error.
   * @param {any} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async logoutAllAuth(req: any, res: Response, next: NextFunction) {
    try {
      await this.authService.logoutAll(req, res);
      response.success(res, 200, "Se han cerrado todas las sesiones");
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }
}
