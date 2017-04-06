'use strict';

switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    module.exports = require('./config/webpack.prod')({ env: 'production' });
    break;
  case 'test':
    module.exports = require('./config/webpack.test')({ env: 'test' });
  case 'dev':
  case 'development':
  default:
    module.exports = require('./config/webpack.dev')({ env: 'development' });
}
