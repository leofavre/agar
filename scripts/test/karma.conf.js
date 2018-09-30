const { relative, join } = require('path');
const webpackConfig = require('./webpack.config.js');

const { AGAR_SCOPE, AGAR_SCOPE_PATH, AGAR_PACKAGES_ROOT } = process.env;

let reports = {
  reporters: ['mocha'],
  mochaReporter: {
    showDiff: true
  }
};

if (AGAR_SCOPE === '*') {
  reports = {
    ...reports,
    reporters: [...reports.reporters, 'coverage-istanbul'],
    coverageIstanbulReporter: {
      dir: 'coverage',
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true
    }
  };
}

const basePath = relative(__dirname, '.');
const cssFiles = join(AGAR_SCOPE_PATH, 'src/**/*.css');
const testFiles = join(AGAR_PACKAGES_ROOT, '*', 'src/**/**.+(test|spec).js');
const urlRoot = 'root';
const proxyIn = join(`/${urlRoot}/`);
const proxyOut = join(proxyIn, 'base', AGAR_PACKAGES_ROOT, '/');

module.exports = (config) => {
  config.set({
    ...reports,
    webpack: webpackConfig(),
    browsers: [
      'ChromeHeadlessNoSandbox'
    ],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    basePath,
    urlRoot,
    proxies: {
      [proxyIn]: proxyOut
    },
    singleRun: true,
    frameworks: ['mocha', 'chai-sinon'],
    files: [
      {
        pattern: cssFiles,
        watched: true,
        served: true
      },
      {
        pattern: testFiles,
        watched: false
      }
    ],
    preprocessors: {
      [testFiles]: ['webpack']
    }
  });
};
