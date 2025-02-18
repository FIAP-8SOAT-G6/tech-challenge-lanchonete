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

interface Configuration {
  database: DatabaseConfig;
  cache: Omit<DatabaseConfig, "dialect">;
}

const config: { [key: string]: Configuration } = {
  development: {
    database: {
      username: process.env.DATABASE_USER!,
      password: process.env.DATABASE_PASSWORD!,
      database: process.env.DATABASE_NAME!,
      host: process.env.DATABASE_HOST!,
      dialect: process.env.DATABASE_DIALECT! as Dialect,
      port: Number(process.env.DATABASE_PORT)!,
    },
    cache: {
      username: process.env.CACHE_USER!,
      password: process.env.CACHE_PASSWORD!,
      database: process.env.CACHE_NAME!,
      host: process.env.CACHE_HOST!,
      port: Number(process.env.CACHE_PORT)!
    },
  },
};

export default config;
