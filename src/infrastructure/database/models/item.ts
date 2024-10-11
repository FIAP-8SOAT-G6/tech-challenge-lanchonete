"use strict";
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from ".";
import Order from "./order";
import Product from "./product";

export default class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
  declare id: CreationOptional<number>;
  declare quantity: number;
  declare unitPrice: number;
  declare totalPrice: number;

  declare order: NonAttribute<Order>;

  declare ProductId: ForeignKey<Product["id"]>;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    quantity: DataTypes.INTEGER,
    unitPrice: DataTypes.DECIMAL(10, 2),
    totalPrice: DataTypes.DECIMAL(10, 2)
  },
  {
    sequelize,
    tableName: "Item"
  }
);

Item.belongsTo(Product);
