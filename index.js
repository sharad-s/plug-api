const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require("./startup/middleware")(app);
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;