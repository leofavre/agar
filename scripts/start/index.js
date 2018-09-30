const { exec, env } = require('shelljs');
const { resolve, relative } = require('path');

module.exports = ({ scope, scopePath, packagesRoot }) => {
  console.log(`Starting ${scope}\n`);

  const webpackConfig = relative('.', resolve(__dirname, 'webpack.config.js'));
  const cmd = `npx webpack-dev-server --config ${webpackConfig}`;

  env.AGAR_SCOPE_PATH = scopePath;
  env.AGAR_PACKAGES_ROOT = packagesRoot;
  exec(cmd);
};
