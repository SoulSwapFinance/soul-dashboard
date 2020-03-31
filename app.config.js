const appConfig = {
    // app title
    name: 'Fantom Metamask',
    // web3 settings
    web3: {
        httpProvider: 'https://rpc.fantom.network/'
    },
    // progressive web application
    usePWA: true,
    // pwa settings
    pwa: {
        // name used in pwa manifest
        name: 'Fantom Metamask'
    },
    // determines if app is chrome extension
    isChromeExtension: !!process.env.VUE_APP_IS_CHROME_EXTENSION,
    // chrome extension settings
    chromeExtension: {
        // chrome extension version - increase version number, if you want to publish in the chrome web store
        version: '0.0.1',
        // chrome extension name
        name: 'Fantom Metamask',
        // chrome extension description
        description: 'Fantom Metamask'
    },
    // default options for production build
    build: {
        // output dir for production build
        outputDir: 'dist'
    }
};

//
if (appConfig.isChromeExtension) {
    appConfig.usePWA = false;

    appConfig.build = {
        ...{
            // output dir for production build
            outputDir: 'chrome-extension/app'
        }
    }
}

// scss variables prepended to every scss file
appConfig.scssData = `
    @import "src/assets/scss/vars";

    $IS_CHROME_EXTENSION: ${appConfig.isChromeExtension ? 'true' : 'false'};
`;

module.exports = appConfig;
