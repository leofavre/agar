const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { basePath, packagePath } = process.env;

module.exports = () => ({
  context: resolve(packagePath, 'public'),
  entry: 'index.js',
  mode: 'development',
  resolve: {
    mainFields: ['module', 'jsnext:main', 'main']
  },
  devServer: {
    open: true,
    hot: true,
    host: '0.0.0.0',
    historyApiFallback: true,
    publicPath: '/',
    contentBase: resolve(basePath),
    watchContentBase: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'index.html'
    })
  ]
});
