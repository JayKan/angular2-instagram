'use strict';

const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

module.exports = function(options) {
  return  webpackMerge(commonConfig(options), {
    devtool: 'cheap-module-source-map',
    entry: {
      main: './src/main.jit.ts',
    },
    output: {
      filename: '[name].js',
    },
    plugins: [
      new ProgressPlugin(),
      new ExtractTextPlugin('styles.css'),
    ],
    devServer: {
      contentBase: './src',
      historyApiFallback: true,
      host: HOST,
      port: PORT,
      stats: {
        cached: true,
        cachedAssets: true,
        chunks: true,
        chunkModules: false,
        colors: true,
        hash: false,
        reasons: true,
        timings: true,
        version: false
      }
    }
  });
};
