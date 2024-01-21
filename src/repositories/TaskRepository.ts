import Task from "../models/Task";
import { IParams } from "../utils/Interfaces";
import Scope from "../utils/scopes";
import { BaseRepository } from "./BaseRepository";

export default class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super(Task);
  }

  public async getAll(params: IParams): Promise<any> {
    params.scopes = "checkOrder";
    return this.safeRun(() => Scope.get(this.model, params));
  }
}
