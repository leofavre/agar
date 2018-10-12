module.exports = (name, scope) => `${name} ${(scope === '*'
  ? 'all packages'
  : scope === '' ? 'package' : scope)}`;
