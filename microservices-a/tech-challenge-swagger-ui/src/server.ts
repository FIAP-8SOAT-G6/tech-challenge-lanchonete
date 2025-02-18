import express, { Application } from "express";
import { swaggerDocs, swaggerUi } from "./swagger";

function disableInformationDisclosure(app: Application) {
    app.disable("x-powered-by");
  }
  
  const app = express();
  disableInformationDisclosure(app);

app.use(express.json());
app.use(["/", "/api-docs"], swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default app;
