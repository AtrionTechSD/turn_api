import Auth from "./Auth";
import Career from "./Career";
import Document from "./Document";
import Image from "./Image";
import Institute from "./Institute";
import Order from "./Order";
import Role from "./Role";
import Task from "./Task";
import User from "./User";

export default class Relation {
  static initRelations() {
    Order.hasMany(Task, {
      as: "tasks",
      foreignKey: "order_id",
    });

    Task.belongsTo(Order, {
      as: "order",
      foreignKey: "order_id",
    });

    Auth.belongsTo(Role, {
      foreignKey: "role_id",
      as: "role",
    });

    Role.hasMany(Auth, {
      as: "auths",
      foreignKey: "role_id",
    });

    Auth.hasOne(User, {
      foreignKey: "auth_id",
      as: "user",
    });

    User.belongsTo(Auth, {
      foreignKey: "auth_id",
      as: "auth",
    });

    Institute.hasMany(User, {
      as: "users",
      foreignKey: "institute_id",
    });

    Institute.hasOne(Image, {
      as: "image",
      foreignKey: "imageableId",
      constraints: false,
      scope: {
        imageableType: "institute",
      },
    });

    User.belongsTo(Institute, {
      as: "institute",
      foreignKey: "institute_id",
    });

    User.hasOne(Image, {
      as: "image",
      foreignKey: "imageableId",
      constraints: false,
      scope: {
        imageableType: "user",
      },
    });

    Career.hasMany(User, {
      as: "users",
      foreignKey: "career_id",
    });

    User.belongsTo(Career, {
      as: "career",
      foreignKey: "career_id",
    });

    Order.belongsTo(User, {
      as: "client",
      foreignKey: "client_id",
    });

    Order.hasMany(Image, {
      as: "images",
      foreignKey: "imageableId",
      constraints: false,
      scope: {
        imageableType: "order",
      },
    });

    Task.hasMany(Image, {
      as: "images",
      foreignKey: "imageableId",
      constraints: false,
      scope: {
        imageableType: "task",
      },
    });

    User.hasMany(Order, {
      as: "orders",
      foreignKey: "client_id",
    });

    Order.hasMany(Document, {
      as: "documents",
      foreignKey: "order_id",
    });
  }
}
