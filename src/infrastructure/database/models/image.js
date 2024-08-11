"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Image.belongsTo(models.Product, {
        foreignKey: "productIdA", // Definindo a chave estrangeira
        as: "product" // Alias para facilitar as associações
      });
    }
  }
  Image.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Products", // Nome da tabela referenciada
          key: "id" // Chave referenciada
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      url: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Image"
    }
  );
  return Image;
};
