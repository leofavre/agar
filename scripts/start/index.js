const { exec } = require('shelljs');
const { resolve, relative } = require('path');
const formatScriptLog = require('../../helpers/formatScriptLog.js');

const { AGAR_SCOPE } = process.env;

module.exports = () => {
  console.log(`${formatScriptLog('Starting', AGAR_SCOPE)}\n`);

  const webpackConfig = relative('.', resolve(__dirname, 'webpack.config.js'));
  const cmd = `npx webpack-dev-server --config ${webpackConfig}`;

  exec(cmd);
};
