import express, { Request, Response, NextFunction } from "express";
import { swaggerUi, swaggerDocs } from "./infrastructure/config/swagger";
import customersAPIRouter from "./api/CustomersAPI";
import ordersAPIRouter from "./api/OrdersAPI";
import productAPIRouter from "./api/ProductsAPI";
import webhooksAPIRouter from "./api/WebhooksAPI";

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(customersAPIRouter);
app.use(ordersAPIRouter);
app.use(productAPIRouter);
app.use(webhooksAPIRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: new Error("Route not found").message });
});

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

export default app;
