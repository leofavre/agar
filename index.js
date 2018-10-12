#!/usr/bin/env node
const yargs = require('yargs');
const { existsSync } = require('fs-extra');
const { resolve, relative } = require('path');

const DEFAULT_PACKAGES_ROOT = 'packages';
const DEFAULT_SCOPE = '*';

const CMD_BUILD_DESC = 'Build packages';
const CMD_START_DESC = 'Start development server';
const CMD_TEST_DESC = 'Test packages';
const INVALID_SCOPE = 'Invalid package';
const MANDATORY_PACKAGE = 'A package name must be provided';
const MISSING_COMMAND = 'Please pass a command';
const MISSING_PACKAGE = 'Please pass a package name';
const OPT_ROOT_DESC = 'The packages\'s parent folder';
const OPT_DEBUG_DESC = 'Run tests in debug mode';
const OPT_DEPLOY_DESC = 'Prepare build for deployment';
const OPT_PACKAGE_DESC = 'A package name (mandatory)';
const OPT_SCOPE_DESC = 'A package name (omit for all packages)';

const POSITIONAL_SCOPE = {
  alias: 's',
  string: true,
  description: OPT_SCOPE_DESC,
  default: DEFAULT_SCOPE
};

const argv = yargs
  .locale('en')
  .usage('$0 <cmd> [args]')
  .option('root', {
    alias: 'r',
    string: true,
    description: OPT_ROOT_DESC,
    default: DEFAULT_PACKAGES_ROOT
  })
  .command('build [scope]', CMD_BUILD_DESC, yargs => {
    yargs
      .positional('scope', POSITIONAL_SCOPE)
      .option('deploy', {
        alias: 'D',
        boolean: true,
        description: OPT_DEPLOY_DESC
      });
  })
  .command('start [scope]', CMD_START_DESC, yargs => {
    yargs
      .positional('scope', {
        ...POSITIONAL_SCOPE,
        description: OPT_PACKAGE_DESC,
        demandOption: MISSING_PACKAGE
      });
  })
  .command('test [scope]', CMD_TEST_DESC, yargs => {
    yargs
      .positional('scope', POSITIONAL_SCOPE)
      .option('debug', {
        alias: 'd',
        boolean: true,
        description: OPT_DEBUG_DESC,
        default: false
      });
  })
  .demandCommand(1, 1, MISSING_COMMAND)
  .alias('h', 'help')
  .help()
  .argv;

const {
  _: positionals,
  scope,
  root
} = argv;

const AGAR_PACKAGES_ROOT = root || '.';
const AGAR_SCOPE = scope || '';
const AGAR_SCOPE_PATH =
  relative('.', resolve(AGAR_PACKAGES_ROOT, AGAR_SCOPE)) || '.';

const cmdName = positionals[0];

if (cmdName === 'start' && AGAR_SCOPE === '*') {
  console.log(MANDATORY_PACKAGE);
} else if ((cmdName === 'start' || AGAR_SCOPE !== '*') &&
  !existsSync(AGAR_SCOPE_PATH)) {
  console.log(`${INVALID_SCOPE}: ${AGAR_SCOPE}`);
} else {
  process.env.AGAR_SCOPE = AGAR_SCOPE;
  process.env.AGAR_SCOPE_PATH = AGAR_SCOPE_PATH;
  process.env.AGAR_PACKAGES_ROOT = AGAR_PACKAGES_ROOT;

  const cmd = require(`./scripts/${cmdName}/index.js`);

  if (typeof cmd === 'function') {
    cmd(argv);
  }
}
