const laser = require('yargs');

const dot = (yargs) => {
  yargs
    .positional('port', {
      describe: 'port to bind on',
      default: 5000
    });
};

const mutley = (argv) => {
  if (argv.verbose) {
    console.info(`start server on :${argv.port}`);
  }
};

laser
  .command('serve [port]', 'start the server', dot, mutley)
  .option('verbose', {
    alias: 'v',
    default: false
  })
  .argv;
