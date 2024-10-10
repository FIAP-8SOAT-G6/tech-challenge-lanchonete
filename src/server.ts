import express from "express";
import { swaggerUi, swaggerDocs } from "./infrastructure/config/swagger";
import ControllerFactory from "./infrastructure/factories/ControllerFactory";
import customersAPIRouter from "./api/CustomersAPI";
import ordersAPIRouter from "./api/OrdersAPI";

const app = express();
const productManagementController = ControllerFactory.makeProductManagementController();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(customersAPIRouter);
app.use(ordersAPIRouter);
app.use(productManagementController.getRouter());
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

export default app;
