import request from "supertest";
import { App } from "supertest/types";
import app from "../../server";
import { expect } from "chai";

let env: NodeJS.ProcessEnv;
describe("SwaggerAPI", () => {
  beforeEach(() => {
    env = process.env;
  });

  afterEach(() => {
    process.env = env;
  });

  it("should load docs if SERVERS is unparsable", async () => {
    process.env.SERVERS = '[{"description": "Unparsable URL", url: "}]';
    const response = await request(app).get("/api-docs");
    expect(response.status).to.be.equal(200);
  });

  it("should load docs if SERVERS is parsable", async () => {
    process.env.SERVERS =
      '[{"description": "Parsable URL", url: "http://localhost"}]';
    const response = await request(app).get("/api-docs");
    expect(response.status).to.be.equal(200);
  });
});
