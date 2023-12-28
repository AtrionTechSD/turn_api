import { Connection } from "../db/Connection";
import UserRepository from "../repositories/UserRepository";
import { IParams, IUser } from "../utils/Interfaces";
import tools from "../utils/tools";
import UserService from "./UserService";

export default class ProfileService {
  userRepo: UserRepository = new UserRepository();
  userService: UserService = new UserService();

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
}
