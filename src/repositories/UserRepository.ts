import Auth from "../models/Auth";
import User from "../models/User";
import { IUser } from "../utils/Interfaces";
import { BaseRepository } from "./BaseRepository";

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  public async createProfile(user: IUser, trans: any): Promise<any> {
    const prevUser = await this.find("auth_id", user.auth_id!);
    let newUser: IUser;
    if (prevUser) {
      newUser = await this.update(user, prevUser.id!, trans);
    } else {
      newUser = await this.create(user, trans);
    }

    return newUser;
  }
}
