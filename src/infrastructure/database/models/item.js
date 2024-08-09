"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      Item.belongsTo(models.Order);
      Item.belongsTo(models.Product);
    }
  }
  Item.init(
    {
      quantity: DataTypes.INTEGER,
      unitPrice: DataTypes.DECIMAL(10, 2),
      totalPrice: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
