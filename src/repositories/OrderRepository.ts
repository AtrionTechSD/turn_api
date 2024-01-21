import Order from "../models/Order";
import Task from "../models/Task";
import User from "../models/User";
import { BaseRepository } from "./BaseRepository";

export default class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(Order);
  }

  async create(data: any, trans: any): Promise<Order> {
    return this.safeRun(() =>
      this.model.create(data, {
        transaction: trans,
        include: [
          {
            model: Task,
            as: "tasks",
          },
          {
            model: User,
            as: "client",
          },
        ],
      })
    );
  }
}
