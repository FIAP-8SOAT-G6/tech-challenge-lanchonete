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
      description: 'Documentação criada como requesito da primeira fase do tech challenge - Software Architecture',
      contact: {
        name: 'GitHub',
        url: 'https://github.com/FIAP-8SOAT-G6/tech-challenge-lanchonete'
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
// console.log('Swagger Options:', swaggerOptions);

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// console.log(swaggerDocs)

module.exports = {
  swaggerUi,
  swaggerDocs
};
