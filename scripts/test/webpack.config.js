const { resolve } = require('path');
const notGitIgnored = require('../../helpers/notGitIgnored.js');

const { AGAR_PACKAGES_ROOT } = process.env;

const context = resolve(AGAR_PACKAGES_ROOT, 'src');

module.exports = () => ({
  mode: 'development',
  resolve: {
    mainFields: ['module', 'jsnext:main', 'main']
  },
  context,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: {
            esModules: true
          }
        },
        include (filePath) {
          return notGitIgnored(filePath);
        },
        exclude: /(test|spec)\.js$/
      }
    ]
  }
});
