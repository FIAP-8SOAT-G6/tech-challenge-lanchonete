const express = require('express');

const app = express();

app.use(express.json());

app.get("/", async function (req, res) {
  return res.send({
    message: "Hello World"
  })
});

module.exports = app;