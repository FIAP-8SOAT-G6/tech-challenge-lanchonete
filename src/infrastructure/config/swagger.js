const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const port = process.env.PORT_SERVER || 3000;
const serverUrl = `http://localhost:${port}`;

// Configurações do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Tech challenge lanchonete',
      version: '1.0.0',
      description: 'Pensar em uma descrição',
      contact: {
        name: 'Grupo 6',
        email: 'Nomes dos integrantes do grupo'
      }
    },
    servers: [
      {
        url: serverUrl,
        description: 'Servidor de desenvolvimento'
      }
    ]
  },
  apis: ['./src/routes/*.js'],
};
console.log('Swagger Options:', swaggerOptions);

const swaggerDocs = swaggerJsDoc(swaggerOptions);

console.log(swaggerDocs)

module.exports = {
  swaggerUi,
  swaggerDocs
};
