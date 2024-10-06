("use strict");
import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "sequelize";
import { sequelize } from ".";
import Product from "./product";

export default class Image extends Model<
  InferAttributes<Image>,
  InferCreationAttributes<Image>
> {
  declare id: CreationOptional<number>;
  declare url: string;

  declare ProductId: ForeignKey<Product["id"]>;
}

Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    url: DataTypes.STRING
  },
  {
    sequelize,
    tableName: "Image"
  }
);
