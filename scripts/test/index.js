const { exec } = require('shelljs');
const { resolve, relative } = require('path');
const formatScriptLog = require('../../helpers/formatScriptLog.js');

const { AGAR_SCOPE } = process.env;

module.exports = ({ debug }) => {
  console.log(`${formatScriptLog('Testing', AGAR_SCOPE)}\n`);

  const karmaConfig = relative('.', resolve(__dirname, 'karma.conf.js'));

  const cmd = `npx karma start ${karmaConfig} --colors` +
    `${debug ? ' --browsers=Chrome --single-run=false --auto-watch' : ''}`;

  exec(cmd);
};
