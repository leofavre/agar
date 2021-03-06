const { sep } = require('path');
const camelcase = require('camelcase');

module.exports = (pkg) => {
  const dirs = pkg.split(sep);
  return camelcase(`${dirs[dirs.length - 1]}`);
};
