import { Router } from "express";
import Controller from "./Controller";
import IController from "./IController";
import OrderService from "../services/OrderService";
import OrderRoutes from "../routes/OrderRoutes";
import response from "../utils/response";

export default class OrderController extends Controller implements IController {
  router: Router = Router();
  prefix: string = "orders";
  private orderService: OrderService = new OrderService();

  constructor() {
    super();
    new OrderRoutes(this.router, this).initRoutes();
  }

  async createOrder(req: any, res: any) {
    this.safeRun(async () => {
      const newOrder = await this.orderService.createOrder(req.body);
      response.success(res, 201, newOrder, "Pedido creado exitosamente");
    }, res);
  }
  async updateOrder(req: any, res: any) {
    this.safeRun(async () => {
      const orderId = req.params.id;
      const updated = await this.orderService.updateOrder(orderId, req.body);
      response.success(res, 201, updated, "Pedido actualizado ");
    }, res);
  }
  async changeStatus(req: any, res: any) {
    this.safeRun(async () => {
      const orderId = req.params.id;
      const updated = await this.orderService.changeStatus(orderId, req.body);
      response.success(res, 201, updated, "Status actualizado ");
    }, res);
  }

  async getOrders(req: any, res: any) {
    this.safeRun(async () => {
      const orders = await this.orderService.getOrders(req.query);
      response.success(res, 200, orders, "Pedidos cargados");
    }, res);
  }
  async findOrders(req: any, res: any) {
    this.safeRun(async () => {
      const orderId = req.params.id;
      const order = await this.orderService.findOrder(orderId, req.query);
      response.success(res, 200, order, "Pedido encontrado");
    }, res);
  }
  async deleteOrders(req: any, res: any) {
    this.safeRun(async () => {
      const orderId = req.params.id;
      const deleted = await this.orderService.deleteOrder(orderId);
      response.success(res, 200, deleted, "Pedido eliminado");
    }, res);
  }

  async setImages(req: any, res: any) {
    this.safeRun(async () => {
      const orderId = req.params.id;
      const images = await this.orderService.setImages(
        orderId,
        req.body.images
      );
      response.success(res, 201, images, "Imágenes añadidas al pedido");
    }, res);
  }
}
