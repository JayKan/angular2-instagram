'use strict';

module.exports = config => {
  const options = {
    basePath: '',

    frameworks: ['jasmine'],

    files: ['karma.entry.js'],

    preprocessors: {
      'karma.entry.js': ['coverage', 'webpack', 'sourcemap']
    },

    webpack: require('./webpack.config'),

    webpackServer: {
      noInfo: true
    },

    reporters: [
      // 'mocha',
      'dots'
    ],

    logLevel: config.LOG_INFO,

    colors: true,

    autoWatch: true,

    singleRun: false,

    browsers: ['Chrome']
  };

  config.set(options);
};
