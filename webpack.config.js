'use strict';

const development = require('./config/webpack.dev');
const production = require('./config/webpack.prod');
const test = require('./config/webpack.test');

switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    module.exports = env => production(Object.assign({}, { env: 'production' }, env));
    break;
  case 'test':
    module.exports = env => test(Object.assign({}, { env: 'test' }, env));
  case 'dev':
  case 'development':
  default:
    module.exports = env => development(Object.assign({}, { env: 'development' }, env));
}
