"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_1 = require("./infrastructure/config/swagger");
const ControllerFactory_1 = __importDefault(require("./infrastructure/factories/ControllerFactory"));
const app = (0, express_1.default)();
const productManagementController = ControllerFactory_1.default.makeProductManagementController();
const customerManagementController = ControllerFactory_1.default.makeCustomerManagementController();
const ordersController = ControllerFactory_1.default.makeOrdersController();
app.use(express_1.default.json());
app.use('/api-docs', swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerDocs));
app.use(productManagementController.getRouter());
app.use(ordersController.getRouter());
app.use(customerManagementController.getRouter());
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});
exports.default = app;
