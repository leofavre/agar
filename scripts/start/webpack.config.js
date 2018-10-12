const { resolve, dirname } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const globby = require('globby');
const uniq = require('lodash.uniq');
const notGitIgnored = require('../../helpers/notGitIgnored.js');

const { AGAR_SCOPE_PATH, AGAR_PACKAGES_ROOT } = process.env;

const context = resolve(AGAR_SCOPE_PATH, 'public');

const watchedfoldersWithCssFiles = uniq(globby
  .sync(`${AGAR_SCOPE_PATH}/**/*.css`)
  .filter(notGitIgnored)
  .map(dirname));

const contentBase = [
  resolve(AGAR_PACKAGES_ROOT),
  ...watchedfoldersWithCssFiles.map(dirPath => resolve(dirPath))
];

module.exports = () => ({
  context,
  entry: './index.js',
  mode: 'development',
  resolve: {
    mainFields: ['module', 'jsnext:main', 'main']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader/url', 'file-loader' ]
      }
    ]
  },
  devServer: {
    open: true,
    hot: true,
    host: '0.0.0.0',
    historyApiFallback: true,
    contentBase,
    watchContentBase: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './index.html'
    })
  ]
});
