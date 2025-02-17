import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

type Server = {
  description: string;
  url: string;
};

function loadServers(): Server[] {
  try {
    const serversString = process.env.SERVERS!;
    const servers = JSON.parse(serversString);
    return servers;
  } catch (error: any) {
    console.error(
      "Could not parse the available servers.\nError: ",
      error.message
    );
  }
  return [];
}

const servers = loadServers();

// Configurações do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Tech challenge lanchonete",
      version: "1.0.0",
      description:
        "Documentação criada como requesito do tech challenge - Software Architecture",
      contact: {
        name: "GitHub",
        url: "https://github.com/FIAP-8SOAT-G6/tech-challenge-lanchonete",
      },
    },
    servers,
  },
  apis: ["./src/routes/*.yaml"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
