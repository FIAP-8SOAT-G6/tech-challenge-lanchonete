import { Application } from "express";
import app from "./server";
const PORT_SERVER = process.env.PORT_SERVER || 3000;

function configureHealthRoutes(app: Application) {
  app.get("/health/liveness", async function (_, res) {
    return res.status(200).json({});
  });
}

async function init() {
  configureHealthRoutes(app);

  const server = app.listen(PORT_SERVER, () => {
    console.log(`Server running on port ${PORT_SERVER}`);
    console.log(`Documentação da API disponível em http://localhost:${PORT_SERVER}/api-docs`);
  });

  process.on("SIGINT", function onSigint() {
    console.info("SIGINT (ctrl-c in docker). Graceful shutdown", new Date().toISOString());
    shutdown();
  });

  process.on("SIGTERM", function onSigterm() {
    console.info("SIGTERM (docker container stop). Graceful shutdown", new Date().toISOString());
    shutdown();
  });

  function shutdown() {
    server.close(function onServerClosed(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      process.exit(0);
    });
  }
}

init();
