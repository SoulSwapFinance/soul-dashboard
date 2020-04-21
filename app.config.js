const appConfig = {
    // app title
    name: 'Fantom Metamask',
    // app description
    description: 'Fantom Metamask',
    // app keywords
    keywords: 'fantom, metamask',
    // apollo client settings
    apollo: {
        // list of providers. if one of them is unavailable, another is randomly picked
        providers: [
            {
                http: 'https://api.fantom.rocks/api',
                // for subscriptions
                ws: '',
            },
            {
                http: 'https://api2.fantom.rocks/api',
                // for subscriptions
                ws: '',
            },
        ],
        // index into providers array of default provider or 'random' - takes index randomly
        defaultProviderIndex: 'random',
    },
    // web3 settings
    web3: {
        httpProvider: 'https://rpc.fantom.network/',
    },
    // used in links pointing to fantom explorer
    explorerUrl: 'https://explorer.fantom.network/',
    // progressive web application
    usePWA: true,
    // pwa settings
    pwa: {
        // name used in pwa manifest
        name: 'Fantom Metamask',
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
        description: 'Fantom Metamask',
    },
    // default options for production build
    build: {
        // output dir for production build
        outputDir: 'dist',
    },
};

//
if (appConfig.isChromeExtension) {
    appConfig.usePWA = false;

    appConfig.build = {
        ...{
            // output dir for production build
            outputDir: 'chrome-extension/app',
        },
    };
}

// scss variables prepended to every scss file
appConfig.scssData = `
    // @import "src/assets/scss/vars";

    $IS_CHROME_EXTENSION: ${appConfig.isChromeExtension ? 'true' : 'false'};
`;

module.exports = appConfig;
