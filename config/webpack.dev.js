'use strict';

const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackOnBuildPlugin = require('on-build-webpack');
const electron = require('electron-connect').server.create({
  path: path.resolve(__dirname, '../src/electron/')
});

const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

module.exports = function(options) {
  const ELECTRON = options.electron;
  let initialBuild = true;
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
      new WebpackOnBuildPlugin(stats => {
        // this will run only after the first build has finished
        if (initialBuild && ELECTRON) {
          initialBuild = false;
          // in development mode we're using electron-connect to run the client
          // otherwise since webpack-dev-server running and checking for changes
          // it should be started manually with "electron ./public"
          electron.start();
        }
      })
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
