import { Router } from "express";
import IController from "./IController";
import CareerRoutes from "../routes/CareerRoutes";
import CareerService from "../services/CareerService";
import response from "../utils/response";
import Controller from "./Controller";

export default class CareerController
  extends Controller
  implements IController
{
  router: Router = Router();
  prefix: string = "careers";
  careerService: CareerService = new CareerService();

  constructor() {
    super();
    new CareerRoutes(this.router, this).initRoutes();
  }

  public async createCareer(req: any, res: any) {
    this.safeRun(async () => {
      const newCareer = await this.careerService.createCareer(req.body);
      response.success(res, 201, newCareer, "Carrera registrada");
    }, res);
  }

  public async updateCareer(req: any, res: any) {
    this.safeRun(async () => {
      const updatedCareer = await this.careerService.updateCareer(
        req.params.id,
        req.body
      );
      response.success(res, 201, updatedCareer, "Carrera registrada");
    }, res);
  }

  public async getCareers(req: any, res: any) {
    this.safeRun(async () => {
      const updatedCareer = await this.careerService.getCareers(req.query);
      response.success(res, 200, updatedCareer, "Carrera registrada");
    }, res);
  }

  public async findCareer(req: any, res: any) {
    this.safeRun(async () => {
      const updatedCareer = await this.careerService.findCareer(
        req.params.id,
        req.query
      );
      response.success(res, 200, updatedCareer, "Carrera registrada");
    }, res);
  }

  public async deleteCareer(req: any, res: any) {
    this.safeRun(async () => {
      const deletedCareer = await this.careerService.deteleCareer(
        req.params.id
      );
      response.success(res, 200, deletedCareer, "Carrera registrada");
    }, res);
  }
}
