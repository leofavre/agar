const { join } = require('path');
const { readFile, pathExists } = require('fs-extra');
const stringReplaceAsync = require('string-replace-async');
const bundleCssImports = require('./bundleCssImports.js');

const { AGAR_PACKAGES_ROOT } = process.env;

const replacer = async (match, cssPath, end) => {
  const fullCssPath = join(AGAR_PACKAGES_ROOT, cssPath);

  try {
    if (pathExists(fullCssPath)) {
      const cssFile = await readFile(fullCssPath, 'utf8');
      const cssBundle = await bundleCssImports(fullCssPath)(cssFile);
      console.log(`Injected:\n${fullCssPath}\n`);
      return `${cssBundle.replace('`', '\\`')}${end}`;
    }
  } catch (err) {
    console.log(`Failed to inject CSS in ${fullCssPath}.`);
    console.warn(err);
  }

  return match;
};

module.exports = fileAsString =>
  stringReplaceAsync(
    fileAsString,
    /@import.*?(?:["'])((?!\/\/)(?!https?:\/\/).*?)(?:[\\"']).*?;?(<|$)/gm,
    replacer
  );
