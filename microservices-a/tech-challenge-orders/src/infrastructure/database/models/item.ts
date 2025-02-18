"use strict";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from ".";
import Order from "./order";

export default class Item extends Model<
  InferAttributes<Item>,
  InferCreationAttributes<Item>
> {
  declare id: CreationOptional<number>;
  declare quantity: number;
  declare unitPrice: number;
  declare totalPrice: number;

  declare order: NonAttribute<Order>;

  declare productId: number;
  declare productName: string;
  declare productDescription: string;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productName: DataTypes.STRING,
    productDescription: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    unitPrice: DataTypes.DECIMAL(10, 2),
    totalPrice: DataTypes.DECIMAL(10, 2),
  },
  {
    sequelize,
    tableName: "Item",
  }
);
