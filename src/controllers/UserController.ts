import { Router } from "express";
import IController from "./IController";
import response from "../utils/response";
import UserService from "../services/UserService";
import UserRoutes from "../routes/UserRoutes";
import Controller from "./Controller";

export default class UserController extends Controller implements IController {
  public router: Router = Router();
  public prefix: string = "users";

  private userService: UserService = new UserService();

  constructor() {
    super();
    new UserRoutes(this.router, this).initRoutes();
  }

  public async getUsers(req: any, res: any) {
    this.safeRun(async () => {
      const users = await this.userService.getUsers(req.query);
      response.success(res, 200, users);
    }, res);
  }

  public async findUser(req: any, res: any) {
    this.safeRun(async () => {
      const user = await this.userService.findUser(req.params.id, req.query);
      response.success(res, 200, user);
    }, res);
  }

  public async createUser(req: any, res: any) {
    this.safeRun(async () => {
      const user = req.body;
      const newUser = await this.userService.createUser(user);
      response.success(res, 201, newUser);
    }, res);
  }

  public async updateUser(req: any, res: any) {
    this.safeRun(async () => {
      const userToUpdate = req.body;
      const userId = req.params.id;
      const updatedUser = await this.userService.updateUser(
        userToUpdate,
        userId
      );
      response.success(res, 200, updatedUser);
    }, res);
  }

  public async deleteUser(req: any, res: any) {
    this.safeRun(async () => {
      const userId = req.params.id;
      const deletedUser = await this.userService.deleteUser(userId);
      response.success(res, 200, deletedUser);
    }, res);
  }

  public async restoreUser(req: any, res: any) {
    this.safeRun(async () => {
      const userId = req.params.id;
      const restoredUser = await this.userService.restoreUser(userId);
      response.success(res, 200, restoredUser);
    }, res);
  }

  public async setProfileImage(req: any, res: any) {
    try {
      const userId = req.params.id;
      const image = await this.userService.setProfileImage(userId, req.body);
      response.success(res, 200, image, "Imagen de perfil actualizada");
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }
}
