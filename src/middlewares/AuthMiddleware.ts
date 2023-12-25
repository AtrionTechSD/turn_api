import { NextFunction, Request, Response } from "express";
import response from "../utils/response";
import jwt from "jsonwebtoken";
import config from "../../app.config";
import { AuthRepository } from "../repositories/AuthRepository";
import Middleware from "./Middleware";

class AuthMiddleware extends Middleware {
  async auth(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const authToken = await this.verifyTokenExists(req, res);
      const decoded = this.verifyTokenIsValid(authToken, res);

      const auth = await this.validateSessionId(decoded, res);

      req.auth = auth.dataValues;
      next();
    } catch (error: any) {
      response.error(res, 500, error.message);
      return;
    }
  }

  isRole(role: string) {
    return (req: any, res: Response, next: NextFunction) => {
      try {
        const auth: any = req.auth;
        if (auth.role.name == role || role == "any") {
          next();
          return;
        } else {
          response.error(res, 419, "No dispone de permisos para esta acción");
          return;
        }
      } catch (error: any) {
        response.error(res, 500, error.message);
        return;
      }
    };
  }

  /* Check if token was provided */
  private async verifyTokenExists(req: Request, res: Response): Promise<any> {
    return new Promise((resolve, reject) => {
      const authToken: any =
        req.headers.authorization || req.cookies.accessToken;
      if (!authToken) {
        reject({
          code: 401,
          message: "No se ha identificado el token de autenticación",
        });
      }
      resolve(authToken.split(" ")[1]);
    });
  }

  /* Check if token provided is valid */
  private verifyTokenIsValid(authToken: string, res: Response) {
    return jwt.verify(
      authToken,
      config.auth.secret,
      (err: any, decoded: any) => {
        if (err) {
          throw {
            code: 401,
            message: "El token suministrado no es válido",
          };
        }
        return decoded;
      }
    );
  }

  /* Check if token has not been invalidated */
  private async validateSessionId(decoded: any, res: Response) {
    try {
      const authRepository = new AuthRepository();
      const auth = await authRepository.find("id", decoded.id, false, {
        include: "role",
      });
      if (auth.session_id !== decoded.session_id) {
        throw {
          code: 401,
          message: "El token suministrado ya no es válido",
        };
      }
      return auth;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new AuthMiddleware();
