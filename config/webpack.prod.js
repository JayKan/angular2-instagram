'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const NoEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = function(options) {
  return webpackMerge(commonConfig(options), {
    devtool: 'source-map',
    entry: {
      main: './src/main.aot.ts',
    },
    output: {
      filename: '[name].[chunkhash].js',
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: 'src/favicon.ico', to: '' }
      ]),
      new ExtractTextPlugin('styles.[chunkhash].css'),
      new NoEmitOnErrorsPlugin(),
      new WebpackMd5Hash(),
      new UglifyJsPlugin({
        comments: false,
        compress: {
          dead_code: true, // eslint-disable-line camelcase
          screw_ie8: true, // eslint-disable-line camelcase
          unused: true,
          warnings: false
        },
        mangle: {
          screw_ie8: true  // eslint-disable-line camelcase
        }
      })
    ]
  });
};
