import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IModel } from "./IModel";
import { Connection } from "../db/Connection";
import Order from "./Order";

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
  declare done_at: string;
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    done_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
