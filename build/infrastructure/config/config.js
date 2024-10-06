"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config = {
    development: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: "lanchonete-db",
        dialect: "postgres",
        port: Number(process.env.CONTAINER_PORT_DB)
    }
};
exports.default = config;
