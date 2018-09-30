#!/usr/bin/env node
const yargs = require('yargs');
const { existsSync } = require('fs-extra');
const { resolve, relative } = require('path');

const CMD_START_DESC = 'Start development server';
const INVALID_SCOPE = 'Invalid scope';
const MISSING_COMMAND = 'Please choose a command';
const MISSING_SCOPE = 'Please choose a scope';
const OPT_BASE_DESC = 'Path to the packages\' folder';
const OPT_SCOPE_DESC = 'Package affected by script';

const POSITIONAL_SCOPE = {
  alias: 's',
  string: true,
  description: OPT_SCOPE_DESC,
  default: '*'
};

const argv = yargs
  .locale('en')
  .usage('$0 <cmd> [args]')
  .option('base', {
    alias: 'b',
    string: true,
    description: OPT_BASE_DESC,
    default: 'packages'
  })
  .command('start [scope]', CMD_START_DESC, yargs => {
    yargs
      .positional('scope', {
        ...POSITIONAL_SCOPE,
        demandOption: MISSING_SCOPE
      });
  })
  .demandCommand(1, 1, MISSING_COMMAND)
  .alias('h', 'help')
  .help()
  .argv;

const { _: commands, scope, base: basePath } = argv;
const packagePath = relative('.', resolve(basePath, scope));

if (scope !== '*' && !existsSync(packagePath)) {
  console.log(`${INVALID_SCOPE}: ${scope}`);
} else {
  const cmd = require(`./scripts/${commands[0]}/index.js`);

  if (typeof cmd === 'function') {
    cmd({
      ...argv,
      basePath,
      packagePath
    });
  }
}
