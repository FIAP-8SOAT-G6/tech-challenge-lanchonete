const express = require("express");
const { swaggerUi, swaggerDocs } = require("./infrastructure/config/swagger");
const ControllerFactory = require("./infrastructure/factories/ControllerFactory");


const app = express();
const productManagementController =
  ControllerFactory.makeProductManagementController();
const customerManagementController =
  ControllerFactory.makeCustomerManagementController();
const ordersController = ControllerFactory.makeOrdersController();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(productManagementController.getRouter());
app.use(ordersController.getRouter());
app.use(customerManagementController.getRouter());
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

module.exports = app;
