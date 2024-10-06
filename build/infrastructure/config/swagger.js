"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUi = exports.swaggerDocs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const port = process.env.PORT_SERVER || 3000;
const serverUrl = `http://localhost:${port}`;
// Configurações do Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Tech challenge lanchonete",
            version: "1.0.0",
            description: "Documentação criada como requesito da primeira fase do tech challenge - Software Architecture",
            contact: {
                name: "GitHub",
                url: "https://github.com/FIAP-8SOAT-G6/tech-challenge-lanchonete"
            }
        },
        servers: [
            {
                url: serverUrl,
                description: "Servidor de desenvolvimento"
            }
        ]
    },
    apis: ["./src/routes/*.yaml"]
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
exports.swaggerDocs = swaggerDocs;
