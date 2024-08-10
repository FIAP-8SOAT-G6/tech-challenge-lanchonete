"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.Item);
      Order.belongsTo(models.Customer);
    }
  }
  Order.init(
    {
      code: DataTypes.STRING,
      status: DataTypes.STRING,
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
