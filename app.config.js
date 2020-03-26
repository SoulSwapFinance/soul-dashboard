const appConfig = {
    // app title
    name: 'Fantom Wallet',
    // progressive web application
    usePWA: true,
    // pwa settings
    pwa: {
        // name used in pwa manifest
        name: 'Fantom Wallet'
    },
    // determines if app is chrome extension
    isChromeExtension: !!process.env.VUE_APP_IS_CHROME_EXTENSION,
    // default options for production build
    build: {
        // output dir for production build
        outputDir: 'dist'
    }
};

//
if (appConfig.isChromeExtension) {
    appConfig.usePWA = false;
    //
    appConfig.chromeExtensionDir = 'chrome-extension';

    appConfig.build = {
        ...{
            // output dir for production build
            outputDir: `${appConfig.chromeExtensionDir}/app`
        }
    }
}

module.exports = appConfig;
