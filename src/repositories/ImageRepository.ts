import Image from "../models/Image";
import { IImage } from "../utils/Interfaces";
import { BaseRepository } from "./BaseRepository";
import InstituteRepository from "./InstituteRepository";
import OrderRepository from "./OrderRepository";
import TaskRepository from "./TaskRepository";
import UserRepository from "./UserRepository";

export default class ImageRepository extends BaseRepository<Image> {
  userRepo: UserRepository = new UserRepository();
  instituteRepo: InstituteRepository = new InstituteRepository();
  taskRepo: TaskRepository = new TaskRepository();
  orderRepo: OrderRepository = new OrderRepository();
  constructor() {
    super(Image);
  }

  public async asignToUser(
    userId: number,
    image: IImage,
    trans: any
  ): Promise<any> {
    const user = await this.userRepo.findById(userId, { include: "image" });
    image.imageableType = "user";
    image.imageableId = user.id;
    if (user.image) {
      return await this.update(image, user.image.id, trans);
    } else {
      return await this.create(image, trans);
    }
  }

  public async asignToInstitute(
    instituteID: number,
    image: IImage,
    trans: any
  ): Promise<any> {
    const institute = await this.instituteRepo.findById(instituteID, {
      include: "image",
    });
    image.imageableType = "institute";
    image.imageableId = institute.id;
    if (institute.image) {
      return await this.update(image, institute.image.id, trans);
    } else {
      return await this.create(image, trans);
    }
  }

  public async asignToOrder(
    orderId: number,
    image: IImage,
    trans: any
  ): Promise<any> {
    const order = await this.orderRepo.findById(orderId);
    image.imageableType = "order";
    image.imageableId = order.id;
    return await this.create(image, trans);
  }

  public async asignToTask(
    taskId: number,
    image: IImage,
    trans: any
  ): Promise<any> {
    const task = await this.taskRepo.findById(taskId);
    image.imageableType = "task";
    image.imageableId = task.id;
    return await this.create(image, trans);
  }
}
