'use strict';

const path = require('path');

const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const helpers = require('./helpers');

module.exports = function(options) {
  return webpackMerge.strategy({
    module: 'replace'
  })(
    commonConfig(options),
    {
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: 'ts-loader'
          },
          helpers.rules.html
        ]
      }
    }
  );
}
