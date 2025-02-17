"use strict";

import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute
} from "sequelize";
import { sequelize } from ".";
import Item from "./item";

class Order extends Model<InferAttributes<Order, { omit: "items" }>, InferCreationAttributes<Order, { omit: "items" }>> {
  declare id: CreationOptional<number>;
  declare code: string;
  declare status: string;
  declare paymentStatus: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare customerId: number | null;

  declare items?: NonAttribute<Item[]>;
  declare createItem: HasManyCreateAssociationMixin<Item, "id">;
  declare removeItem: HasManyRemoveAssociationMixin<Item, number>;

  declare static associations: {
    items: Association<Order, Item>;
  };
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    code: DataTypes.STRING,
    status: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: "Order"
  }
);
Order.hasMany(Item);
Item.belongsTo(Order);

export default Order;
