import { Router } from "express";
import IController from "./IController";
import response from "../utils/response";
import UserService from "../services/UserService";
import UserRoutes from "../routes/UserRoutes";

export default class UserController implements IController {
  public router: Router = Router();
  public prefix: string = "users";

  private userService: UserService = new UserService();

  constructor() {
    new UserRoutes(this.router, this).initRoutes();
  }

  public async getUsers(req: any, res: any, next: any) {
    try {
      const users = await this.userService.getUsers(req.query);
      response.success(res, 200, users);
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }

  public async findUser(req: any, res: any, next: any) {
    try {
      const user = await this.userService.findUser(req.params.id, req.query);
      response.success(res, 200, user);
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }

  public async createUser(req: any, res: any, next: any) {
    try {
      const user = req.body;
      const newUser = await this.userService.createUser(user);
      response.success(res, 201, newUser);
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }

  public async updateUser(req: any, res: any, next: any) {
    try {
      const userToUpdate = req.body;
      const userId = req.params.id;
      const updatedUser = await this.userService.updateUser(
        userToUpdate,
        userId
      );
      response.success(res, 200, updatedUser);
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }

  public async deleteUser(req: any, res: any, next: any) {
    try {
      const userId = req.params.id;
      const deletedUser = await this.userService.deleteUser(userId);
      response.success(res, 200, deletedUser);
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }
}
