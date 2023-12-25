import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Connection } from "../db/Connection";
import { IModel } from "./IModel";

class Role
  extends Model<InferAttributes<Role>, InferCreationAttributes<Role>>
  implements IModel
{
  createdAt?: string | undefined;
  updatedAt?: string | undefined;

  declare id: number;
  declare name: string;

  getSearchables(): string[] {
    return ["name"];
  }
  /* istanbul ignore next */
  getRelations(): string[] {
    return ["auths", "auths.user"];
  }
}

const connection = Connection.getConnectionInstance();

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    modelName: "Role",
    tableName: "roles",
    sequelize: connection.getConnection(),
    createdAt: false,
    updatedAt: false,
  }
);

export default Role;
