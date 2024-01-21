import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IModel } from "./IModel";
import { Connection } from "../db/Connection";
import User from "./User";

class Career
  extends Model<InferAttributes<Career>, InferCreationAttributes<Career>>
  implements IModel
{
  declare id: number;
  declare name: string;
  declare sigla: string;
  declare grade: string;
  declare createdAt: string;
  declare updatedAt: string;
  declare deletedAt?: string;

  getSearchables(): string[] {
    return ["name", "sigla", "grade"];
  }

  /* istanbul ignore next */
  getRelations(): string[] {
    return ["users", "users.institute"];
  }
}

const connection = Connection.getConnectionInstance();

Career.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    sigla: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    grade: {
      type: DataTypes.STRING,
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
    modelName: "Career",
    tableName: "careers",
    sequelize: connection.getConnection(),
    paranoid: true,
  }
);

export default Career;
