import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IModel } from "./IModel";
import { Connection } from "../db/Connection";
import Task from "./Task";
import tools from "../utils/tools";
import moment from "moment";
import { ITask } from "../utils/Interfaces";

class Order
  extends Model<InferAttributes<Order>, InferCreationAttributes<Order>>
  implements IModel
{
  declare id: number;
  declare createdAt: string;
  declare updatedAt: string;
  declare deletedAt: string;
  declare title: string;
  declare description: string;
  declare due_at: string;
  declare formated_due_at: string;
  declare left: number;
  declare leftPercent: object;
  declare done_at: string;
  declare formated_done_at: string;
  declare price: number;
  declare status: string;
  declare type: string;
  declare client_id: number;

  getSearchables(): string[] {
    return [
      "title",
      "description",
      "price",
      "status",
      "type",
      "client_id",
      "due_at",
      "done_at",
    ];
  }
  /* istanbul ignore next */
  getRelations(): string[] {
    return [
      "client",
      "client.institute",
      "client.image",
      "client.career",
      "tasks",
      "tasks.images",
      "images",
    ];
  }
}

const connection = Connection.getConnectionInstance();
Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
    },

    due_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    formated_due_at: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      get(this: Order): string {
        return moment(this.dataValues.due_at).format("DD/MM/YYYY");
      },
    },
    done_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    formated_done_at: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      get(this: Order): string | null {
        if (!this.dataValues.done_at) return null;
        return moment(this.dataValues.done_at).format("DD/MM/YYYY");
      },
    },
    left: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      get(this: Order): number {
        const left = tools.diffDates(new Date(), this.dataValues.due_at);
        return left < 0 && this.status == "Completado"
          ? 100
          : left < 0
          ? 0
          : left;
      },
    },
    leftPercent: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      get(this: Order): Object {
        const tasks = (this.dataValues as any).tasks || [];
        const pendientes = tasks.filter((t: ITask) => t.status == 0).length;
        const completes = tasks.filter((t: ITask) => t.status == 1).length;
        return {
          pendientes,
          completes,
          percent: Math.round((completes / tasks.length) * 10000) / 100,
        };
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      get(this: Order): string {
        return tools.dateToHuman(this.dataValues.createdAt);
      },
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      get(this: Order): string {
        return tools.dateToHuman(this.dataValues.updatedAt);
      },
    },
  },
  {
    modelName: "Order",
    tableName: "orders",
    sequelize: connection.getConnection(),
    paranoid: true,
  }
);

export default Order;
