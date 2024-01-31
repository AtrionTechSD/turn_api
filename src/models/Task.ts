import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IModel } from "./IModel";
import { Connection } from "../db/Connection";
import Order from "./Order";
import moment from "moment";
import tools from "../utils/tools";

class Task
  extends Model<InferAttributes<Task>, InferCreationAttributes<Task>>
  implements IModel
{
  declare id: number;
  declare createdAt: string;
  declare updatedAt: string;
  declare deletedAt: string;
  declare title: string;
  declare status: number;
  declare due_at: string;
  declare formated_due_at: string;
  declare left: number;
  declare leftPercent: number;
  declare done_at: string;
  declare formated_done_at: string;
  declare order_id: number;

  /* istanbul ignore next */
  getSearchables(): string[] {
    return ["title", "due_at", "status", "order_id"];
  }
  /* istanbul ignore next */
  getRelations(): string[] {
    return ["order", "order.client", "order.client.institute"];
  }
}

const connection = Connection.getConnectionInstance();
Task.init(
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

    due_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    formated_due_at: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      get(this: Task): string {
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
      get(this: Task): string | null {
        if (!this.dataValues.done_at) return null;
        return moment(this.dataValues.done_at).format("DD/MM/YYYY");
      },
    },
    left: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      get(this: Task): number {
        const left = tools.diffDates(new Date(), this.dataValues.due_at);
        return left < 0 && this.status == 1 ? 100 : left < 0 ? 0 : left;
      },
    },
    leftPercent: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      get(this: Task): number {
        const leftPerc =
          Math.round(
            (this.left /
              tools.diffDates(this.createdAt, this.dataValues.due_at)) *
              10000
          ) / 100;
        return leftPerc < 0 && this.status == 1
          ? 100
          : leftPerc < 0
          ? 0
          : leftPerc;
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    order_id: {
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
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    modelName: "Task",
    tableName: "tasks",
    sequelize: connection.getConnection(),
    paranoid: true,
    scopes: {
      checkOrder: () => ({
        include: {
          model: Order,
          as: "order",
          where: {
            deletedAt: null,
          },
        },
      }),
    },
  }
);

export default Task;
