require("dotenv").config();

const config = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: 'lanchonete-db',
    dialect: 'postgres',
    port: process.env.CONTAINER_PORT_DB
  }
}

module.exports = config;