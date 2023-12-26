import { NextFunction, Request, Router } from "express";
import InstituteService from "../services/InstituteService";
import response from "../utils/response";
import IController from "./IController";
import InstituteRoutes from "../routes/InstituteRoutes";

export default class InstituteController implements IController {
  public router: Router = Router();
  public prefix: string = "institutes";

  private institueService: InstituteService = new InstituteService();

  constructor() {
    new InstituteRoutes(this.router, this).initRoutes();
  }

  public async createInstitute(req: Request, res: any, next: NextFunction) {
    try {
      const newInsti = await this.institueService.createInstitute(req.body);
      response.success(res, 201, newInsti);
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }

  public async getInstitutes(req: Request, res: any, next: NextFunction) {
    try {
      const institutes = await this.institueService.getInstitutes(req.query);
      response.success(res, 200, institutes);
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }
  public async findInstitute(req: any, res: any, next: NextFunction) {
    try {
      const instituteId = req.params.id;
      const institute = await this.institueService.findInstitute(
        instituteId,
        req.query
      );
      response.success(res, 200, institute);
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }
}
