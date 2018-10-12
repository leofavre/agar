const { resolve } = require('path');

const { AGAR_PACKAGES_ROOT } = process.env;

const context = resolve(AGAR_PACKAGES_ROOT);

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
        include: /src(\\|\/)/,
        exclude: /(test|spec)\.js$/
      }
    ]
  }
});
