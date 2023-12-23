import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Connection } from "../db/Connection";
import { IModel } from "./IModel";
import Role from "./Role";

class Auth
  extends Model<InferAttributes<Auth>, InferCreationAttributes<Auth>>
  implements IModel
{
  declare id: number;
  declare email: string;
  declare password: string;
  declare lastlogin: string;
  declare role_id: number;
  declare session_id: number;
  declare status: number;
  declare verified_at: string;
  declare createdAt: string;
  declare updatedAt: string;
  declare deletedAt: string;

  getSearchables() {
    return ["email", "role_id", "last_login", "verified_at", "status"];
  }
}

const connection = Connection.getConnectionInstance();

Auth.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastlogin: {
      type: DataTypes.DATE,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: connection.getConnection(),
    tableName: "auths",
    modelName: "Auth",
    paranoid: true,
  }
);

Auth.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role",
});

Role.hasMany(Auth, {
  as: "auths",
  foreignKey: "role_id",
});
export default Auth;
