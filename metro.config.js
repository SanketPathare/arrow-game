const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Locate tslib ES6 entry point
const tslibEs6 = path.resolve(__dirname, 'node_modules/tslib/tslib.es6.js');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Fix for: [TypeError: Cannot destructure property '__extends' of 'tslib.default' as it is undefined]
  // Metro package exports resolution mistakenly loads tslib/modules/index.js which relies on default CJS export.
  if (
    moduleName === 'tslib' ||
    moduleName.startsWith('tslib/') ||
    (moduleName === '../tslib.js' && context.originModulePath && context.originModulePath.includes('tslib'))
  ) {
    return {
      filePath: tslibEs6,
      type: 'sourceFile',
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
