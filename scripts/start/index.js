const { exec, env } = require('shelljs');
const { resolve, relative } = require('path');

module.exports = ({ scope, basePath, packagePath }) => {
  console.log(`Starting ${scope !== '*' ? scope : 'all packages'}\n`);

  const webpackConfig = relative('.', resolve(__dirname, 'webpack.config.js'));
  const cmd = `npx webpack-dev-server --config ${webpackConfig}`;

  env.basePath = basePath;
  env.packagePath = packagePath;
  exec(cmd);
};
