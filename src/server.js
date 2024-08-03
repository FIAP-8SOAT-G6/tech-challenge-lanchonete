// TODO colocar adapter pro express
const express = require('express');
const { swaggerUi, swaggerDocs } = require('./config/swagger');
const exampleRoutes = require('./routes/exampleRoutes');
const ControllerFactory = require('./infrastructure/factories/ControllerFactory');

const app = express();
const productManagementController = ControllerFactory.makeProductManagementController();
const ordersController = ControllerFactory.makeOrdersController();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', exampleRoutes);
app.use(productManagementController.getRouter());
app.use(ordersController.getRouter());

module.exports = app;
