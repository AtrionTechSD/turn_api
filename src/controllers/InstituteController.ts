import { NextFunction, Request, Router } from "express";
import InstituteService from "../services/InstituteService";
import response from "../utils/response";
import IController from "./IController";
import InstituteRoutes from "../routes/InstituteRoutes";
import Controller from "./Controller";

export default class InstituteController
  extends Controller
  implements IController
{
  public router: Router = Router();
  public prefix: string = "institutes";

  private institueService: InstituteService = new InstituteService();

  constructor() {
    super();
    new InstituteRoutes(this.router, this).initRoutes();
  }

  public async createInstitute(req: Request, res: any) {
    this.safeRun(async () => {
      const newInsti = await this.institueService.createInstitute(req.body);
      response.success(res, 201, newInsti);
    }, res);
  }

  public async getInstitutes(req: Request, res: any) {
    this.safeRun(async () => {
      const institutes = await this.institueService.getInstitutes(req.query);
      response.success(res, 200, institutes);
    }, res);
  }
  public async findInstitute(req: any, res: any) {
    this.safeRun(async () => {
      const instituteId = req.params.id;
      const institute = await this.institueService.findInstitute(
        instituteId,
        req.query
      );
      response.success(res, 200, institute);
    }, res);
  }

  public async updateInstitute(req: any, res: any) {
    this.safeRun(async () => {
      const instituteId = req.params.id;
      const institute = await this.institueService.updateInstitute(
        req.body,
        instituteId
      );
      response.success(res, 200, institute);
    }, res);
  }
  public async deleteInstitute(req: any, res: any) {
    this.safeRun(async () => {
      const instituteId = req.params.id;
      const institute = await this.institueService.deleteInstitute(instituteId);
      response.success(res, 200, institute);
    }, res);
  }

  public async setLogo(req: any, res: any) {
    this.safeRun(async () => {
      const image = await this.institueService.setLogo(req.params.id, req.body);
      response.success(res, 201, image, "Logo actualizado");
    }, res);
  }
}
