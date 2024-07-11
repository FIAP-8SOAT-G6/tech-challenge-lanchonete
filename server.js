const express = require('express');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/", async function (req, res) {
  return res.send({
    message: "Hello World"
  })
});

app.listen(PORT, () => console.log(`Express Server running on port ${PORT}`))
