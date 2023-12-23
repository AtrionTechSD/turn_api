import { Model, ModelStatic } from "sequelize";
import { Scope } from "../utils/scopes";
import { IParams } from "../utils/Interfaces";

export class BaseRepository<T extends Model> {
  private model;
  private primaryKeyName: string;

  constructor(model: ModelStatic<T>) {
    this.model = model;
    this.primaryKeyName = this.model.primaryKeyAttribute;
  }

  protected async safeRun(method: () => Promise<any>): Promise<any> {
    try {
      return await method();
    } catch (error) {
      throw error;
    }
  }

  public async getAll(
    params: IParams
  ): Promise<{ count: number; rows: Array<any> }> {
    return this.safeRun(() => Scope.get(this.model, params));
  }

  public async find(
    key: string,
    value: string | number | Boolean,
    withTrashed?: boolean,
    params?: any
  ): Promise<T> {
    return this.safeRun(() =>
      Scope.get(this.model, {
        ...params,
        limit: 1,
        filter: [`${key}:${value}`],
        withtrashed: withTrashed,
      })
    );
  }

  public async findById(dataId: number): Promise<T> {
    return this.safeRun(() => this.find("id", dataId));
  }

  public async first(): Promise<T> {
    return this.safeRun(() => {
      const params: Object = {
        order: [this.model.primaryKeyAttribute],
      };
      return this.model.findOne(params);
    });
  }

  public async last(): Promise<T> {
    return this.safeRun(() => {
      const params: Object = {
        order: [[this.model.primaryKeyAttribute, "DESC"]],
      };
      return this.model.findOne(params);
    });
  }

  public async create(data: any): Promise<T> {
    return this.safeRun(() => this.model.create(data));
  }

  public async update(data: any, primaryKey: string | number): Promise<T> {
    return this.safeRun(async () => {
      const dataToUpdate = await this.find(this.primaryKeyName, primaryKey);
      return dataToUpdate.update(data);
    });
  }

  public async delete(primaryKey: string | number): Promise<T> {
    return this.safeRun(async () => {
      const dataToDelete = await this.find(this.primaryKeyName, primaryKey);
      return dataToDelete.destroy();
    });
  }

  public async restore(primaryKey: string | number): Promise<T> {
    return this.safeRun(async () => {
      const dataToRestore = await this.find(
        this.primaryKeyName,
        primaryKey,
        true
      );
      return dataToRestore.restore();
    });
  }

  public async forceDelete(primaryKey: string | number): Promise<T> {
    return this.safeRun(async () => {
      const primaryKeyName: string = this.model.primaryKeyAttribute;
      const dataToForceDelete = await this.find(
        this.primaryKeyName,
        primaryKey,
        true
      );
      return dataToForceDelete.destroy({
        force: true,
      });
    });
  }
}
