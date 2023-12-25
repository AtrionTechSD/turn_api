import { Connection } from "../db/Connection";
import Auth from "../models/Auth";
import { BaseRepository } from "./BaseRepository";

export class AuthRepository extends BaseRepository<Auth> {
  constructor() {
    super(Auth);
  }

  public async assingRole(
    role_id: number,
    auth: Auth,
    trans: any
  ): Promise<any> {
    return this.safeRun(() => {
      return auth.update({ role_id: role_id }, { transaction: trans });
    });
  }
}
