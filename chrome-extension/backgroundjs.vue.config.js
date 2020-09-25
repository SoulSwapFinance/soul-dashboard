const appConfig = require('../app.config.js');

console.log('--- app config ---');
console.log(appConfig);

module.exports = {
    lintOnSave: false,
    publicPath: '',
    outputDir: `${appConfig.chromeExtension.outputDir}/${appConfig.chromeExtension.outputDirBackgroundJs}`,

    configureWebpack: {
        output: {
            libraryExport: 'default',
        },
    },
};
