import { Router } from "express";
import Controller from "./Controller";
import IController from "./IController";
import TaskRoutes from "../routes/TaskRoutes";
import TaskService from "../services/TaskService";
import response from "../utils/response";

export default class TaskController extends Controller implements IController {
  router: Router = Router();
  prefix: string = "tasks";
  private taskService: TaskService = new TaskService();
  constructor() {
    super();
    new TaskRoutes(this.router, this).initRoutes();
  }

  async createTask(req: any, res: any) {
    this.safeRun(async () => {
      const newTask = await this.taskService.createTask(
        req.params.orderId,
        req.body
      );
      response.success(res, 201, newTask, "Tarea registrada");
    }, res);
  }

  async updateTask(req: any, res: any) {
    this.safeRun(async () => {
      const updatedTask = await this.taskService.updateTask(
        req.params.id,
        req.body
      );
      response.success(res, 201, updatedTask, "Tarea actualizada");
    }, res);
  }
  async changeStatus(req: any, res: any) {
    this.safeRun(async () => {
      const updatedTask = await this.taskService.changeStatus(
        req.params.id,
        req.body.status
      );
      response.success(res, 201, updatedTask, "Estado de tarea cambiado");
    }, res);
  }

  async deleteTask(req: any, res: any) {
    this.safeRun(async () => {
      const deletedTask = await this.taskService.deleteTask(req.params.id);
      response.success(res, 200, deletedTask, "Tarea eliminada");
    }, res);
  }

  async getTasks(req: any, res: any) {
    this.safeRun(async () => {
      const tasks = await this.taskService.getTasks(
        req.params.orderId,
        req.query
      );
      response.success(res, 200, tasks, "Tareas del pedido");
    }, res);
  }

  async setImages(req: any, res: any) {
    this.safeRun(async () => {
      const taskId = req.params.id;
      const images = await this.taskService.setImages(taskId, req.body.images);
      response.success(res, 201, images, "Imágenes añadidas a la tarea");
    }, res);
  }
}
