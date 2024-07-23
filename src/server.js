const express = require('express');
const { swaggerUi, swaggerDocs } = require('./config/swagger');
const exampleRoutes = require('./routes/exampleRoutes')

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', exampleRoutes);


module.exports = app;