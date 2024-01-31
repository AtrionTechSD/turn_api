import { Connection } from "../db/Connection";
import ImageRepository from "../repositories/ImageRepository";
import UserRepository from "../repositories/UserRepository";
import { IImage, IParams, IUser } from "../utils/Interfaces";

export default class UserService {
  private userRepo: UserRepository = new UserRepository();
  private imageRepo: ImageRepository = new ImageRepository();
  public async getUsers(params: IParams): Promise<any> {
    try {
      const users = await this.userRepo.getAll(params);
      return users;
    } catch (error: any) {
      throw {
        code: 500,
        message: error.message,
      };
    }
  }
  public async findUser(id: number, params: IParams): Promise<any> {
    try {
      const users = await this.userRepo.findById(id, params);
      return users;
    } catch (error: any) {
      throw {
        code: 500,
        message: error.message,
      };
    }
  }
  public async createUser(user: IUser): Promise<any> {
    const { auth_id, ...basicData } = user;
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const newUser = await this.userRepo.create(basicData, trans);
      await trans.commit();
      return newUser;
    } catch (error: any) {
      await trans.rollback();
      throw {
        code: 500,
        message: error.message,
      };
    }
  }

  public async updateUser(user: IUser, userId: number): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();

    const { auth_id, ...basicData } = user;
    try {
      const existingUser = await this.userRepo.findById(userId);
      if (!existingUser) {
        throw {
          code: 404,
          message: "User not found",
        };
      }
      const updatedUser = await this.userRepo.update(basicData, userId, trans);
      await trans.commit();
      return updatedUser;
    } catch (error: any) {
      await trans.rollback();
      throw { code: error.code, message: error.message };
    }
  }

  public async deleteUser(userId: number): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const existingUser = await this.userRepo.findById(userId);
      if (!existingUser) {
        throw {
          code: 404,
          message: "User not found",
        };
      }
      const deletedUser = await this.userRepo.delete(userId, trans);
      await trans.commit();
      return deletedUser;
    } catch (error: any) {
      await trans.rollback();
      throw { code: error.code, message: error.message };
    }
  }

  public async restoreUser(userId: number): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const existingUser = await this.userRepo.findById(userId, {}, true);
      if (!existingUser) {
        throw {
          code: 404,
          message: "User not found",
        };
      }
      const restoredUser = await this.userRepo.restore(userId, trans);
      await trans.commit();
      return restoredUser;
    } catch (error: any) {
      await trans.rollback();
      throw { code: error.code, message: error.message };
    }
  }

  public async setProfileImage(userId: number, image: IImage): Promise<any> {
    const trans = await Connection.getConnectionInstance().getTrans();
    try {
      const imageAssigned = await this.imageRepo.asignToUser(
        userId,
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
