import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IModel } from "./IModel";
import { Connection } from "../db/Connection";
import tools from "../utils/tools";

class Image
  extends Model<InferAttributes<Image>, InferCreationAttributes<Image>>
  implements IModel
{
  declare id: number;
  declare url: string;
  declare caption: string;
  declare imageableType: string;
  declare imageableId: number;
  declare createdAt: string;
  declare updatedAt: string;

  getSearchables(): string[] {
    return ["url", "caption", "imageableId", "imagable_type"];
  }

   /* istanbul ignore next */
  getRelations(): string[] {
    return [];
  }
}

const connecction = Connection.getConnectionInstance();

Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageableType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageableId: {
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
  },
  {
    modelName: "Image",
    tableName: "images",
    sequelize: connecction.getConnection(),
  }
);

export default Image;
