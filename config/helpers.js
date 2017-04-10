'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// webpack rules
exports.rules = {
  html: {
    test: /\.(html)$/,
    loader: 'raw-loader',
    exclude: path.resolve('src/index.html')
  },
  css: {
    test: /\.css$/,
    use: [ 'style-loader', 'css-loader' ]
  },
  scss: {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('css-loader?-autoprefixer!postcss-loader!sass-loader')
  },
  typescript: {
    test: /\.ts$/,
    loader: 'ts-loader',
    exclude: [/\.(spec|e2e)\.ts$/]
  }
};
