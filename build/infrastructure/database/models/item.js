"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require(".");
const product_1 = __importDefault(require("./product"));
class Item extends sequelize_1.Model {
}
exports.default = Item;
Item.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    quantity: sequelize_1.DataTypes.INTEGER,
    unitPrice: sequelize_1.DataTypes.DECIMAL(10, 2),
    totalPrice: sequelize_1.DataTypes.DECIMAL(10, 2)
}, {
    sequelize: _1.sequelize,
    tableName: "Item"
});
Item.belongsTo(product_1.default);
