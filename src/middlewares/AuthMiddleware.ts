import { NextFunction, Request, Response } from "express";
import response from "../utils/response";
import jwt from "jsonwebtoken";
import config from "../../app.config";
import { AuthRepository } from "../repositories/AuthRepository";

class AuthMiddleware {
  async auth(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const authToken = await this.verifyTokenExists(req, res);
      const decoded = this.verifyTokenIsValid(authToken, res);
      const auth = await this.validateSessionId(decoded, res);
      req.auth = auth;
      next();
    } catch (error) {
      return error;
    }
  }

  /* Check if token was provided */
  private async verifyTokenExists(req: Request, res: Response): Promise<any> {
    return new Promise((resolve, reject) => {
      const authToken: any =
        req.headers.authorization || req.cookies.accessToken;
      if (!authToken) {
        reject(
          response.error(
            res,
            401,
            "No se ha identificado el token de autenticación"
          )
        );
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
          throw response.error(res, 401, "El token suministrado no es válido");
        }
        return decoded;
      }
    );
  }

  /* Check if token has not been invalidated */
  private async validateSessionId(decoded: any, res: Response) {
    const authRepository = new AuthRepository();
    const auth = await authRepository.getWithoutPassword({
      filter: [`id: ${decoded.id}`],
      limit: 1,
      include: "role",
    });
    if (auth.session_id !== decoded.session_id) {
      throw response.error(res, 401, "El token suministrado ya no es válido");
    }
    return auth;
  }
}

export default new AuthMiddleware();
