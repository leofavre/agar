const { resolve, dirname } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const globby = require('globby');
const uniq = require('lodash.uniq');

const { AGAR_SCOPE_PATH, AGAR_PACKAGES_ROOT } = process.env;

const watchedCss = uniq(globby
  .sync(`${AGAR_SCOPE_PATH}/**/*.css`)
  .map(dirname));

module.exports = () => ({
  context: resolve(AGAR_SCOPE_PATH, 'public'),
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
    contentBase: [
      resolve(AGAR_PACKAGES_ROOT),
      ...watchedCss.map(filePath => resolve(filePath))
    ],
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
