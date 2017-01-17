'use strict';

const express = require('express');
const logger = require('winston');

const ENV_PRODUCTION = process.env.NODE_ENV === 'production';
const app = express();

require('./config/app')(app);
require('./config/routes')(app, ENV_PRODUCTION);

app.listen(app.get('port'), app.get('host'), error => {
  if (error) {
    logger.error(error);
  } else {
    logger.info(`Server is listening ${app.get('host')}:${app.get('port')}`);
  }
});