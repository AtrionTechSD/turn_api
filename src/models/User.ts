import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Op,
  Sequelize,
} from "sequelize";
import { IModel } from "./IModel";
import { Connection } from "../db/Connection";
import tools from "../utils/tools";
import Image from "./Image";
import Career from "./Career";
import Order from "./Order";
import Auth from "./Auth";

class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements IModel
{
  declare id: number;
  declare name: string;
  declare lastname: string;
  declare fullname: string;
  declare email: string;
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
      "email",
      "address",
      "phone",
      "auth_id",
      "institute_id",
      "career_id",
    ];
  }
  /* istanbul ignore next */
  getRelations() {
    return [
      "auth",
      "auth.role",
      "institute",
      "institute.users",
      "institute.image",
      "image",
      "career",
      "orders",
      "orders.tasks",
    ];
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
      get(this: User): string {
        return tools.dateToHuman(this.dataValues.createdAt);
      },
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
    scopes: {
      /* istanbul ignore next */
      onlyClient: () => ({
        where: {
          [Op.or]: [
            { auth_id: null },
            // Usamos una condición literal para referirnos a la tabla Auth relacionada
            Sequelize.literal(
              "EXISTS (SELECT 1 FROM `Auths` WHERE `Auths`.`id` = `User`.`auth_id` AND `Auths`.`role_id` = 2)"
            ),
          ],
        },
      }),
    },
  }
);

export default User;
