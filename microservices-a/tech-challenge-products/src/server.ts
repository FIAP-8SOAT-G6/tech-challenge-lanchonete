// const express = require("express");
// const app = express();
// const port = process.env.PORT || 3000;
//
// app.get("/", (req, res) => {
//   res.send("Olá, mundo! Estou rodando no Docker!");
// });
//
// app.listen(port, () => {
//   console.log(`Servidor rodando na porta ${port}`);
// });

import express, { Request, Response, NextFunction } from "express";
import { swaggerUi, swaggerDocs } from "./infrastructure/config/swagger";
import productsAPIRouter from "./api/ProductsAPI";

const app = express();
app.disable('x-powered-by');

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(productsAPIRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: new Error("Route not found").message });
});

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

export default app;
