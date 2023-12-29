import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IModel } from "./IModel";
import { Connection } from "../db/Connection";

class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements IModel
{
  declare id: number;
  declare name: string;
  declare lastname: string;
  declare fullname: string;
  declare phone: string;
  declare address: string;
  declare auth_id?: number;
  declare institute_id?: number;
  declare career_id?: number;
  declare createdAt: string;
  declare updatedAt: string;
  declare deletedAt?: string;

  getSearchables(): string[] {
    return [
      "name",
      "lastname",
      "address",
      "phone",
      "auth_id",
      "institute_id",
      "career_id",
    ];
  }
  /* istanbul ignore next */
  getRelations() {
    return ["auth", "auth.role", "institute", "institute.users"];
  }

  fullName() {
    return `${this.name} ${this.lastname}`;
  }
}

const connection = Connection.getConnectionInstance();

User.init(
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
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.VIRTUAL,
      get(this: User): string {
        return `${this.name} ${this.lastname}`;
      },
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    auth_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    institute_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    career_id: {
      type: DataTypes.INTEGER,
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
    modelName: "User",
    sequelize: connection.getConnection(),
    tableName: "users",
    paranoid: true,
  }
);

export default User;
