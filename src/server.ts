import express from "express";
import { swaggerUi, swaggerDocs } from "./infrastructure/config/swagger";
import customersAPIRouter from "./api/CustomersAPI";
import ordersAPIRouter from "./api/OrdersAPI";
import produtctAPIRouter from "./api/ProductsAPI";

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(customersAPIRouter);
app.use(ordersAPIRouter);
app.use(produtctAPIRouter);
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

export default app;
