import { Connection } from "../db/Connection";
import ImageRepository from "../repositories/ImageRepository";
import OrderRepository from "../repositories/OrderRepository";
import { IImage, IOrder, IParams } from "../utils/Interfaces";

export default class OrderService {
  private orderRepo: OrderRepository = new OrderRepository();
  private imageRepo: ImageRepository = new ImageRepository();

  async createOrder(order: IOrder): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const newOrder = await this.orderRepo.create(order, trans);

      await trans.commit();
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

  async changeStatus(orderId: number, status: string): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const editedOrder = await this.orderRepo.update(
        { status },
        orderId,
        trans
      );
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
}
