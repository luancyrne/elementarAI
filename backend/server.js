const express = require('express');
const logger = require('./lib/utils/logger');

const server = express();
const router = express.Router();

server.use(express.json());

const { elementRoutes } = require('./lib/elements');

elementRoutes(router);

server.use('/element', router);

const { PORT } = process.env;

server.listen(PORT, () => {
  logger.info(`Server start | PORT: ${PORT}`);
});

module.exports = server;
