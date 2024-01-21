import { NextFunction } from "express";
import CareerRepository from "../repositories/CareerRepository";
import response from "../utils/response";
import Middleware from "./Middleware";

class CareerMiddleware extends Middleware {
  private careerRepo: CareerRepository = new CareerRepository();
  constructor() {
    super();
  }

  public async isUnique(req: any, res: any, next: NextFunction) {
    try {
      const existingByName = await this.careerRepo.find("name", req.body.name);
      const existingBySigla = await this.careerRepo.find(
        "sigla",
        req.body.sigla
      );
      if (existingByName || existingBySigla) {
        response.error(res, 422, "Esta carrera ya está registrada");
        return;
      }
      next();
    } catch (error: any) {
      response.error(res, 500, error.message);
      return;
    }
  }
}

export default new CareerMiddleware();
