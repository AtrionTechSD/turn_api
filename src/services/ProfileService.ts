import { Connection } from "../db/Connection";
import ImageRepository from "../repositories/ImageRepository";
import UserRepository from "../repositories/UserRepository";
import { IImage, IParams, IUser } from "../utils/Interfaces";
import tools from "../utils/tools";
import UserService from "./UserService";

export default class ProfileService {
  private userRepo: UserRepository = new UserRepository();
  private imageRepo: ImageRepository = new ImageRepository();

  public async createProfile(profile: IUser, authId: number): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      profile.auth_id = tools.parseOrZero(authId);
      const newProfile = await this.userRepo.createProfile(profile, trans);
      await trans.commit();
      return newProfile;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: 500,
        message: error.message,
      };
    }
  }

  public async findProfile(authId: number, params: IParams): Promise<any> {
    try {
      const profile = await this.userRepo.find(
        "auth_id",
        authId,
        false,
        params
      );
      return profile;
    } catch (error: any) {
      throw {
        code: 500,
        message: error.message,
      };
    }
  }

  public async setProfileImage(req: any, image: IImage): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const imageAssigned = await this.imageRepo.asignToUser(
        req.auth.user.id,
        image,
        trans
      );
      await trans.commit();
      return imageAssigned;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: 500,
        message: error.message,
      };
    }
  }
}
