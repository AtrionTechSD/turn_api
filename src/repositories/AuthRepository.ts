import Auth from "../models/Auth";
import { IParams } from "../utils/Interfaces";
import { BaseRepository } from "./BaseRepository";

export class AuthRepository extends BaseRepository<Auth> {
  constructor() {
    super(Auth);
  }

  public async getWithoutPassword(params: IParams): Promise<any> {
    let res: any = await this.getAll(params);
    if (params.limit == 1 && res != null) {
      res.password = null;
    } else if (res) {
      res.rows.forEach((el: any, index: number) => {
        res.rows[index].password = null;
      });
    }
    return res;
  }

  public async assingRole(role_id: number, auth: Auth): Promise<any> {
    return this.safeRun(() => {
      return auth.update({ role_id: role_id });
    });
  }
}
