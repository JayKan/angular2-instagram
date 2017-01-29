'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const NoErrorsPlugin = require('webpack/lib/NoErrorsPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');

//=========================================================
//  ENVIRONMENT VARS
//---------------------------------------------------------
const NODE_ENV        = process.env.NODE_ENV;
const ENV_DEVELOPMENT = NODE_ENV === 'development';
const ENV_PRODUCTION  = NODE_ENV === 'production';
const ENV_TEST        = NODE_ENV === 'test';
const HOST            = process.env.HOST || 'localhost';
const PORT            = process.env.PORT || 3000;

//=========================================================
//  LOADERS
//---------------------------------------------------------
const rules = {
  html: {
    test: /\.(html)$/,
    loader: 'raw-loader',
    exclude: path.resolve('src/index.html')
  },
  scss: {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('css?-autoprefixer!postcss!sass')
  },
  typescript: {
    test: /\.ts$/,
    loader: 'ts',
    exclude: [/\.(spec|e2e)\.ts$/]
  }
};

//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = module.exports = {};

config.resolve = {
  extensions: ['.ts', '.js'],
  mainFields: ['module', 'browser', 'main'],
  modules: [
    path.resolve('.'),
    'node_modules'
  ]
};

config.module = {
  rules: [
    rules.html,
    rules.scss,
    rules.typescript,
  ]
};

config.plugins = [
  new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  }),
  new NamedModulesPlugin(),
  new LoaderOptionsPlugin({
    debug: false,
    minimize: ENV_PRODUCTION,
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
];

//=========================================================
// DEVELOPMENT or PRODUCTION
//---------------------------------------------------------
if (ENV_DEVELOPMENT || ENV_PRODUCTION) {
  config.entry = {
    polyfills: './src/polyfills.ts'
  };

  config.output = {
    path: path.resolve('./public'),
    publicPath: '/'
  };

  config.plugins.push(
    new CommonsChunkPlugin({
      name: ['polyfills'],
      minChunks: Infinity
    }),
    new ExtractTextPlugin(ENV_PRODUCTION ? 'styles.[chunkhash].css' : 'styles.css'),
    new HtmlWebpackPlugin({
      chunkSortMeta: 'dependency',
      filename: 'index.html',
      hash: false,
      inject: 'body',
      template: './src/index.html'
    })
  );
}

//=========================================================
//  DEVELOPMENT ONLY
//---------------------------------------------------------
if (ENV_DEVELOPMENT) {
  config.devtool = 'cheap-module-source-map';

  config.entry.main = './src/main.jit.ts';

  config.output.filename = '[name].js';

  config.plugins.push(new ProgressPlugin());

  config.devServer = {
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
  };
}

//=========================================================
//  PRODUCTION ONLY
//---------------------------------------------------------
if (ENV_PRODUCTION) {
  config.devtool = 'source-map';

  config.entry.main = './src/main.aot.ts';

  config.output.filename = '[name].[chunkhash].js';

  config.plugins.push(
    new NoErrorsPlugin(),
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
  );
}

//=========================================================
//  Test
//---------------------------------------------------------
if (ENV_TEST) {
  config.devtool = 'inline-source-map';

  config.module.rules = [
    {
      test: /\.ts$/,
      loader: 'ts'
    },
    rules.html
  ];
}