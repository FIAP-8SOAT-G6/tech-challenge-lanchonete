import { createClient } from "redis";
import config from "../config/config";
import { RedisClientType } from "@redis/client";

const env = process.env.NODE_ENV || "development";
const cacheConfig = config[env].cache;

export class RedisClient {
  private client?: RedisClientType;

  public async getClient() {
    if (!this.client || !this.client.isOpen) {
      const { username, password, host, port, database } = cacheConfig;
      this.client = createClient({
        username: username,
        password: password,
        socket: {
          host,
          port,
        },
        database: Number(database),
      });
      await this.client.connect();
      this.client.on("error", (error) =>
        console.error(`Redis Client Error: ${error.message}`)
      );
    }
    return this.client;
  }
}
