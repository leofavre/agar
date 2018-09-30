const { resolve } = require('path');

const { AGAR_PACKAGES_ROOT } = process.env;

module.exports = () => ({
  mode: 'development',
  resolve: {
    mainFields: ['module', 'jsnext:main', 'main']
  },
  context: resolve(AGAR_PACKAGES_ROOT),
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
