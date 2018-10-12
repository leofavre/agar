const globby = require('globby');

module.exports = filePath => !globby.gitignore.sync()(filePath);
