module.exports = (name, scope) => `${name} ${(scope !== '*' && scope !== ''
  ? scope : 'all packages')}`;
