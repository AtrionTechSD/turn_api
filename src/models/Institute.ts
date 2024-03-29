import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IModel } from "./IModel";
import { Connection } from "../db/Connection";

class Institute
  extends Model<InferAttributes<Institute>, InferCreationAttributes<Institute>>
  implements IModel
{
  declare id: number;
  declare name: string;
  declare sigla: string;
  declare createdAt?: string;
  declare updatedAt?: string;
  declare deletedAt?: string;

  getSearchables(): string[] {
    return ["name", "sigla"];
  }

  /* istanbul ignore next */
  getRelations(): string[] {
    return [
      "users",
      "users.auth",
      "users.auth.role",
      "users.career",
      "users.image",
      "image",
    ];
  }
}

const connection = Connection.getConnectionInstance();

Institute.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sigla: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    modelName: "Institute",
    tableName: "institutes",
    paranoid: true,
    sequelize: connection.getConnection(),
  }
);

export default Institute;
