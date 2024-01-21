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
  declare left: number;
  declare leftPercent: number;
  declare done_at: string;
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
      allowNull: true,
      get(this: Order): string {
        return tools.dateToHuman(this.dataValues.due_at);
      },
    },
    done_at: {
      type: DataTypes.DATE,
      allowNull: true,
      get(this: Order): string | null {
        if (!this.dataValues.done_at) return null;
        return tools.dateToHuman(this.dataValues.done_at);
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
      get(this: Order): number {
        const leftPerc =
          Math.round(
            (this.left /
              tools.diffDates(this.createdAt, this.dataValues.due_at)) *
              10000
          ) / 100;
        return leftPerc < 0 && this.status == "Completado"
          ? 100
          : leftPerc < 0
          ? 0
          : leftPerc;
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
