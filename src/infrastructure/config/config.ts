import "dotenv/config";
import { Dialect } from "sequelize";

type DatabaseConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
  port: number;
};

const config: { [key: string]: DatabaseConfig } = {
  development: {
    username: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
    host: "lanchonete-db",
    dialect: "postgres",
    port: Number(process.env.CONTAINER_PORT_DB)!
  }
};

export default config;
