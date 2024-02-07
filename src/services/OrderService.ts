import { Connection } from "../db/Connection";
import DocumentRepository from "../repositories/DocumentRepository";
import ImageRepository from "../repositories/ImageRepository";
import OrderRepository from "../repositories/OrderRepository";
import TaskRepository from "../repositories/TaskRepository";
import {
  IDocument,
  IImage,
  IOrder,
  IParams,
  OStatus,
} from "../utils/Interfaces";

export default class OrderService {
  private orderRepo: OrderRepository = new OrderRepository();
  private taskRepo: TaskRepository = new TaskRepository();
  private imageRepo: ImageRepository = new ImageRepository();
  private documentRepo: DocumentRepository = new DocumentRepository();

  async createOrder(order: IOrder): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      order.tasks = order.tasks.map((t) => ({ ...t, id: null }));
      let newOrder = await this.orderRepo.create(order, trans);
      for (let i in order.tasks) {
        const task = order.tasks[i];
        await this.taskRepo.create({ ...task, order_id: newOrder.id }, trans);
      }
      await trans.commit();
      newOrder = await this.orderRepo.findById(newOrder.id, {
        include: "tasks,client",
      });
      return newOrder;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }
  async updateOrder(orderId: number, order: IOrder): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const updatedOrder = await this.orderRepo.update(order, orderId, trans);
      await trans.commit();
      return updatedOrder;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  async changeStatus(orderId: number, newStatus: any): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const editedOrder = await this.orderRepo.update(
        newStatus,
        orderId,
        trans
      );
      if (newStatus.status == OStatus.completed) {
        await this.taskRepo.update(
          { status: 1, done_at: new Date() },
          orderId,
          trans,
          "order_id"
        );
      }
      await trans.commit();
      return editedOrder;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  async getOrders(params: IParams): Promise<any> {
    try {
      const orders = await this.orderRepo.getAll(params);
      return orders;
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  async findOrder(orderId: number, params: IParams): Promise<any> {
    try {
      const order = await this.orderRepo.findById(orderId, params);
      return order;
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }
  async deleteOrder(orderId: number): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const order = await this.orderRepo.delete(orderId, trans);
      await trans.commit();
      return order;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  public async setImages(orderId: number, images: IImage[]): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const imagesAssigned: any = [];
      for (const image of images) {
        const newImage = await this.imageRepo.asignToOrder(
          orderId,
          image,
          trans
        );

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

  public async addDocuments(
    orderId: number,
    documents: IDocument[]
  ): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const order: IOrder = await this.orderRepo.findById(orderId);
      if (!order) {
        throw {
          code: 404,
          message: "Pedido no encontrado",
        };
      }
      const results = [];
      documents = documents.map((document) => ({
        title: document.title,
        description: document.description,
        order_id: orderId,
        type: document.type,
        url: document.url,
      }));
      for (let document of documents) {
        const result = await this.documentRepo.create(document, trans);
        results.push(result);
      }
      await trans.commit();
      return results;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }

  public async removeDocument(documentId: number): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      await this.documentRepo.delete(documentId, trans);
      await trans.commit();
      return true;
    } catch (error: any) {
      await trans.rollback();
      console.log(error);
      throw {
        code: error.code,
        message: error.message,
      };
    }
  }
}
