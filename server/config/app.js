'use strict';

const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const paths = require('./paths');

module.exports = app => {
  // server address
  app.set('host', process.env.HOST || 'localhost');
  app.set('port', process.env.PORT || 5000);

  // HTTP headers
  app.disable('x-powered-by');
  app.use(helmet.frameguard({ action: 'deny' }));
  app.use(helmet.hsts({ force: true, maxAge: 7776000000 })); // 90 days
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());
  app.use(helmet.ieNoOpen());

  // gzip compression
  app.use(compression());

  // development mode only
  if (process.env.NODE_ENV === 'development') {
    app.use(require('morgan')('dev'));
  }

  // static files
  app.use(express.static(paths.static, { index: false }));
  app.use(favicon(paths.favicon));
};
