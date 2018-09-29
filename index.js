const yargs = require('yargs');
const { existsSync } = require('fs-extra');
const { resolve, relative } = require('path');

const CMD_BUILD_DESC = 'Build packages';
const CMD_START_DESC = 'Start development server';
const CMD_SCREEN_TEST_DESC = 'Test interface';
const CMD_TEST_DESC = 'Test packages';
const INVALID_SCOPE = 'Invalid scope';
const MISSING_COMMAND = 'Please choose a command';
const MISSING_SCOPE = 'Please choose a scope';
const OPT_BASE_DESC = 'Path to the packages\' folder';
const OPT_DEBUG_DESC = 'Run in debug mode';
const OPT_DEPLOY_DESC = 'Prepare for deployment';
const OPT_SCOPE_DESC = 'Package affected by script';

const argv = yargs
  .locale('en')
  .option('scope', {
    alias: 's',
    string: true,
    description: OPT_SCOPE_DESC,
    default: '*'
  })
  .option('base', {
    alias: 'b',
    string: true,
    description: OPT_BASE_DESC,
    default: 'packages'
  })
  .command('build', CMD_BUILD_DESC, {
    deploy: {
      alias: 'D',
      boolean: true,
      description: OPT_DEPLOY_DESC
    }
  })
  .command('test', CMD_TEST_DESC, {
    debug: {
      alias: 'd',
      boolean: true,
      description: OPT_DEBUG_DESC
    }
  })
  .command('start', CMD_START_DESC, {
    scope: {
      string: true,
      description: OPT_SCOPE_DESC,
      default: undefined,
      demandOption: MISSING_SCOPE
    }
  })
  .command('screen-test', CMD_SCREEN_TEST_DESC)
  .demandCommand(1, 1, MISSING_COMMAND)
  .alias('h', 'help')
  .help()
  .argv;

const { _: commands, scope, base: basePath } = argv;
const packagePath = relative('.', resolve(basePath, scope));

if (scope !== '*' && !existsSync(packagePath)) {
  console.log(`${INVALID_SCOPE}: ${scope}`);
} else {
  const cmd = require(`./${commands[0]}/index.js`);

  if (typeof cmd === 'function') {
    cmd({
      ...argv,
      basePath,
      packagePath
    });
  }
}
