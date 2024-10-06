"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
("use strict");
const sequelize_1 = require("sequelize");
const _1 = require(".");
class Image extends sequelize_1.Model {
}
exports.default = Image;
Image.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    url: sequelize_1.DataTypes.STRING
}, {
    sequelize: _1.sequelize,
    tableName: "Image"
});
