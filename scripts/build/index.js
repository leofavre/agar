const globby = require('globby');
const { readFile } = require('fs-extra');
const getJsPathsExceptTests = require('./helpers/getJsPathsExceptTests.js');
const injectCssContent = require('./helpers/injectCssContent.js');
const safeWriteFile = require('./helpers/safeWriteFile.js');
const transformEs6ToEs5 = require('./helpers/transformEs6ToEs5.js');
const transformImportToCjs = require('./helpers/transformImportToCjs.js');
const getPackageName = require('./helpers/getPackageName.js');
const bundleJsImports = require('./helpers/bundleJsImports.js');

const { AGAR_SCOPE, AGAR_SCOPE_PATH } = process.env;

module.exports = ({ deploy }) => {
  console.log(`Building ${AGAR_SCOPE !== '*' ? AGAR_SCOPE : 'all packages'}\n`);

  const packagePaths = (AGAR_SCOPE === '*')
    ? globby.sync(AGAR_SCOPE_PATH, { onlyDirectories: true })
    : [AGAR_SCOPE_PATH];

  packagePaths.forEach(pkg => (async () => {
    console.log(`Started:\n${pkg}\n`);

    let context;

    // Injects CSS in `src/` files (DEPLOYMENT only!)

    context = await getJsPathsExceptTests(`${pkg}/src`);

    if (deploy) {
      await Promise.all(context.map(filePath => readFile(filePath, 'utf8')
        .then(injectCssContent)
        .then(safeWriteFile(filePath))));
    }

    // Outputs `dist/es/es6/` and `dist/es/es5/` from `src/`

    await Promise.all(context.map((filePath) => {
      const es6Path = filePath.replace('/src/', '/dist/es/es6/');
      const es5Path = filePath.replace('/src/', '/dist/es/es5/');

      return readFile(filePath, 'utf8')
        .then(injectCssContent)
        .then(safeWriteFile(es6Path))
        .then(transformEs6ToEs5)
        .then(safeWriteFile(es5Path));
    }));

    // Outputs `dist/cjs/es6/` and `dist/cjs/es5/` from `dist/es/es6/`

    context = await getJsPathsExceptTests(`${pkg}/dist/es/es6`);

    await Promise.all(context.map((filePath) => {
      const es6Path = filePath.replace('/dist/es/es6/', '/dist/cjs/es6/');
      const es5Path = filePath.replace('/dist/es/es6/', '/dist/cjs/es5/');

      return readFile(filePath, 'utf8')
        .then(transformImportToCjs)
        .then(safeWriteFile(es6Path))
        .then(transformEs6ToEs5)
        .then(safeWriteFile(es5Path));
    }));

    // Outputs `dist/iife/es6/` and `dist/iife/es5/` from `dist/es/es6/index.js`

    context = [`${pkg}/dist/es/es6/index.js`];

    await Promise.all(context.map((filePath) => {
      const es6Path = filePath.replace('/dist/es/es6/', '/dist/iife/es6/');
      const es5Path = filePath.replace('/dist/es/es6/', '/dist/iife/es5/');
      const packageName = getPackageName(pkg);

      return Promise.resolve(filePath)
        .then(bundleJsImports(packageName))
        .then(injectCssContent)
        .then(safeWriteFile(es6Path))
        .then(transformEs6ToEs5)
        .then(safeWriteFile(es5Path));
    }));

    console.log(`Finished:\n${pkg}\n`);
  })());
};
