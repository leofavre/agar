#!/usr/bin/env node
const yargs = require('yargs');
const { existsSync } = require('fs-extra');
const { resolve, relative } = require('path');

const CMD_START_DESC = 'Start development server';
const INVALID_SCOPE = 'Invalid package';
const MANDATORY_PACKAGE = 'A package name must be provided';
const MISSING_COMMAND = 'Please pass a command';
const MISSING_PACKAGE = 'Please pass a package name';
const OPT_BASE_DESC = 'Path to the base folder';
const OPT_PACKAGE_DESC = 'A package name';
const OPT_SCOPE_DESC = 'A package name (omit option for all packages)';

const POSITIONAL_SCOPE = {
  alias: 's',
  string: true,
  description: OPT_SCOPE_DESC
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
        description: OPT_PACKAGE_DESC,
        demandOption: MISSING_PACKAGE
      });
  })
  .demandCommand(1, 1, MISSING_COMMAND)
  .alias('h', 'help')
  .help()
  .argv;

const { _: commands, scope = '*', base: basePath } = argv;
const packagePath = relative('.', resolve(basePath, scope));
const cmdName = commands[0];

if (cmdName === 'start' && scope === '*') {
  console.log(MANDATORY_PACKAGE);
} else if ((cmdName === 'start' || scope !== '*') && !existsSync(packagePath)) {
  console.log(`${INVALID_SCOPE}: ${scope}`);
} else {
  const cmd = require(`./scripts/${cmdName}/index.js`);

  if (typeof cmd === 'function') {
    cmd({
      ...argv,
      basePath,
      packagePath
    });
  }
}
