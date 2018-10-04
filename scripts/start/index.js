const { exec } = require('shelljs');
const { resolve, relative } = require('path');

const { AGAR_SCOPE } = process.env;

module.exports = () => {
  console.log(`Starting ${AGAR_SCOPE}\n`);

  const webpackConfig = relative('.', resolve(__dirname, 'webpack.config.js'));
  const cmd = `npx webpack-dev-server --config ${webpackConfig}`;

  exec(cmd);
};
