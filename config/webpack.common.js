'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');

const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const helpers = require('./helpers');

module.exports = function(options) {
  const NODE_ENV = options.env;
  const ELECTRON = options.electron;
  return {
    resolve: {
      extensions: ['.ts', '.js'],
      mainFields: ['module', 'browser', 'main'],
      modules: [
        path.resolve('.'),
        'node_modules'
      ]
    },
    entry: {
      polyfills: './src/polyfills.ts'
    },
    output: {
      path: path.resolve('./public'),
      // in Electron there's no server to render index.html so the path
      // should be relative, otherwise the static resources won't be found
      publicPath: ELECTRON ? '' : '/'
    },
    module: {
      rules: [
        helpers.rules.html,
        helpers.rules.css,
        helpers.rules.scss,
        helpers.rules.typescript
      ]
    },
    plugins: [
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
      }),
      new NamedModulesPlugin(),
      new LoaderOptionsPlugin({
        debug: false,
        minimize: NODE_ENV === 'production',
        options: {
          postcss: [
            autoprefixer({ browsers: ['last 3 versions'] })
          ],
          resolve: {},
          sassLoader: {
            includePaths: ['src/shared'],
            outputStyle: 'compressed',
            precision: 10,
            sourceComments: false
          }
        }
      }),
      new ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        path.resolve('src')
      ),
      new BundleAnalyzerPlugin({
        // this config can be removed when HMR will be supported
        // https://github.com/th0r/webpack-bundle-analyzer/issues/37
        analyzerMode: 'disabled',
        generateStatsFile: true,
        statsFilename: 'stats.json'
      }),
      new CommonsChunkPlugin({
        name: ['polyfills'],
        minChunks: Infinity
      }),
      new HtmlWebpackPlugin({
        chunkSortMode: 'dependency',
        filename: 'index.html',
        hash: false,
        inject: 'body',
        metadata: {
          baseUrl: ELECTRON ? '' : '/'
        },
        template: './src/index.html'
      })
    ]
  }
};
