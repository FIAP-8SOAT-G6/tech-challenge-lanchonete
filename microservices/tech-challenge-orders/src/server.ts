import express, { Request, Response, NextFunction, Application } from "express";
import { swaggerUi, swaggerDocs } from "./infrastructure/config/swagger";
import ordersAPIRouter from "./api/OrdersAPI";
import webhooksAPIRouter from "./api/WebhooksAPI";

function disableInformationDisclosure(app: Application) {
  app.disable("x-powered-by");
}

const app = express();
disableInformationDisclosure(app);

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(ordersAPIRouter);
app.use(webhooksAPIRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: new Error("Route not found").message });
});

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

export default app;
