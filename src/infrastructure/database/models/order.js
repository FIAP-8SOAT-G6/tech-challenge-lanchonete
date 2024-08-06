'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsToMany(models.Product, { through: models.Item, foreignKey: 'orderId' });
    }
  }
  Order.init({
    code: DataTypes.STRING,
    status: DataTypes.STRING,
    totalPrice: DataTypes.DECIMAL(10, 2),
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
