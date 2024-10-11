import express from "express";
import { swaggerUi, swaggerDocs } from "./infrastructure/config/swagger";
import ControllerFactory from "./infrastructure/factories/ControllerFactory";
import customersAPIRouter from "./api/CustomersAPI";

const app = express();
const productManagementController = ControllerFactory.makeProductManagementController();
const ordersController = ControllerFactory.makeOrdersController();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(productManagementController.getRouter());
app.use(ordersController.getRouter());
app.use(customersAPIRouter);
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

export default app;
