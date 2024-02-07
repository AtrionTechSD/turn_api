import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Connection } from "../db/Connection";
import { IModel } from "./IModel";

class Document
  extends Model<InferAttributes<Document>, InferCreationAttributes<Document>>
  implements IModel
{
  getSearchables(): string[] {
    return ["title", "type", "description", "order_id"];
  }
  getRelations(): string[] {
    return ["order"];
  }
  declare id: number;
  declare url: string;
  declare title: string;
  declare type: string;
  declare description: string;
  declare order_id: number;
  declare createdAt: string;
  declare updatedAt: string;
}
const connecction = Connection.getConnectionInstance();

Document.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    sequelize: connecction.getConnection(),
    tableName: "documents",
    modelName: "Document",
    paranoid: true,
  }
);

export default Document;
