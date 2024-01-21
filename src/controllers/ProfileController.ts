import { Router } from "express";
import IController from "./IController";
import ProfileRoutes from "../routes/ProfileRoutes";
import ProfileService from "../services/ProfileService";
import response from "../utils/response";

export default class ProfileController implements IController {
  public router: Router = Router();
  public prefix: string = "profile";
  profileService: ProfileService = new ProfileService();

  constructor() {
    new ProfileRoutes(this.router, this).initRoutes();
  }

  public async createProfile(req: any, res: any) {
    try {
      const newProfile = await this.profileService.createProfile(
        req.body,
        req.auth.id
      );
      response.success(res, 201, newProfile, "Perfil actualizado");
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }

  public async findProfile(req: any, res: any) {
    try {
      const authId = req.auth.id;
      const profile = await this.profileService.findProfile(authId, req.query);
      response.success(res, 200, profile, "Perfil de usuario");
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }

  public async setProfileImage(req: any, res: any) {
    try {
      const image = await this.profileService.setProfileImage(req, req.body);
      response.success(res, 200, image, "Imagen de perfil actualizada");
    } catch (error: any) {
      response.error(res, error.code, error.message);
    }
  }
}
