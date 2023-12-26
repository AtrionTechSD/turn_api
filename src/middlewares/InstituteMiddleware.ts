import { NextFunction, Request, Response } from "express";
import Middleware from "./Middleware";
import response from "../utils/response";
import InstituteRepository from "../repositories/InstituteRepository";

class InstituteMiddleware extends Middleware {
  private instiRepo: InstituteRepository = new InstituteRepository();
  public async isUnique(req: Request, res: Response, next: NextFunction) {
    try {
      const existingInsti = await this.instiRepo.find("name", req.body.name);
      if (existingInsti) {
        response.error(res, 422, "Esta institución ya está registrada");
        return;
      }
      next();
    } catch (error: any) {
      response.error(res, 500, error.message);
      return;
    }
  }
}

export default new InstituteMiddleware();
