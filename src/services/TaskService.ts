import { Connection } from "../db/Connection";
import ImageRepository from "../repositories/ImageRepository";
import TaskRepository from "../repositories/TaskRepository";
import { IImage, IParams, ITask } from "../utils/Interfaces";
import tools from "../utils/tools";

export default class TaskService {
  private taskRepo: TaskRepository = new TaskRepository();
  private imageRepo: ImageRepository = new ImageRepository();
  async createTask(orderId: number, task: ITask): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      orderId = tools.parseOrZero(orderId);
      task.order_id = orderId;
      const newTask = await this.taskRepo.create(task, trans);
      await trans.commit();
      return newTask;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  async getTasks(orderId: number, params: IParams): Promise<any> {
    try {
      params.filter = [...(params.filter || []), `order_id:${orderId}`];
      const tasks = await this.taskRepo.getAll(params);
      return tasks;
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  async updateTask(taskId: number, task: ITask): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const updatedTask = await this.taskRepo.update(task, taskId, trans);
      await trans.commit();
      return updatedTask;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  async changeStatus(taskId: number, status: number): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const updatedTask = await this.taskRepo.update(
        { status: tools.parseOrZero(status) },
        taskId,
        trans
      );
      await trans.commit();
      return updatedTask;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  async deleteTask(taskId: number): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const deletedTask = await this.taskRepo.delete(taskId, trans);
      await trans.commit();
      return deletedTask;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  public async setImages(taskId: number, images: IImage[]): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const imagesAssigned: any = [];
      for (const image of images) {
        const newImage = await this.imageRepo.asignToTask(taskId, image, trans);
        imagesAssigned.push(newImage);
      }
      await trans.commit();
      return imagesAssigned;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: 500,
        message: error.message,
      };
    }
  }
}
