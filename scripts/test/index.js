const { exec, env } = require('shelljs');
const { resolve, relative } = require('path');

module.exports = ({ scope, scopePath, packagesRoot, debug }) => {
  console.log(`Testing ${scope !== '*' ? scope : 'all packages'}\n`);

  const karmaConfig = relative('.', resolve(__dirname, 'karma.conf.js'));
  const cmd = `npx karma start ${karmaConfig} --colors` +
    `${debug ? ' --browsers=Chrome --single-run=false --auto-watch' : ''}`;

  env.AGAR_SCOPE = scope;
  env.AGAR_SCOPE_PATH = scopePath;
  env.AGAR_PACKAGES_ROOT = packagesRoot;
  exec(cmd);
};
