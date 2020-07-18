const appConfig = {
    // app title
    name: 'Fantom PWA Wallet',
    // app description
    description: 'Fantom PWA Wallet',
    // app keywords
    keywords: 'fantom, metamask',
    // apollo client settings
    apollo: {
        // list of providers. if one of them is unavailable, another is randomly picked
        providers: [
            {
                http: 'https://xapi2.fantom.network/api',
                // for subscriptions
                ws: '',
            },
            {
                http: 'https://xapi3.fantom.network/api',
                // for subscriptions
                ws: '',
            },
        ],
        // index into providers array of default provider or 'random' - takes index randomly
        defaultProviderIndex: 'random',
    },
    // used in links pointing to fantom explorer
    explorerUrl: 'https://explorer.fantom.network/',
    // used in links pointing to ethereum explorer
    ethereumExplorerUrl: 'https://etherscan.io/',
    // used in links pointing to binance explorer
    binanceExplorerUrl: 'https://explorer.binance.org/',
    // BNBridge api config
    bnbridgeApi: {
        // url of api point
        url: 'https://api.bnbridge.exchange/api/v1',
        // auth token
        token: '',
    },
    // address of liquidity pool contract
    liquidityPoolContract: '0xb0860633cb84d8290b67638992a68772728d8acb',
    //
    useTestnet: true,
    // testnet config
    testnet: {
        // list of providers. if one of them is unavailable, another is randomly picked
        providers: [
            {
                http: 'https://xapi5.testnet.fantom.network/graphql',
                // for subscriptions
                ws: '',
            },
        ],
        // used in links pointing to fantom explorer
        explorerUrl: 'https://explorer.testnet.fantom.network/',
        // chain id for testnet
        chainId: '0xfa2',
    },
    // progressive web application
    usePWA: true,
    // pwa settings
    pwa: {
        // name used in pwa manifest
        name: 'Fantom PWA Wallet',
    },
    // determines if app is chrome extension
    isChromeExtension: !!process.env.VUE_APP_IS_CHROME_EXTENSION,
    // chrome extension settings
    chromeExtension: {
        // chrome extension version - increase version number, if you want to publish in the chrome web store
        version: '0.0.1',
        // chrome extension name
        name: 'Fantom PWA Wallet',
        // chrome extension description
        description: 'Fantom PWA Wallet',
    },
    // default options for production build
    build: {
        // output dir for production build
        outputDir: 'dist',
    },
    // app settings
    settings: {
        // list of available currencies displayed in settings view ( https://en.wikipedia.org/wiki/ISO_4217 )
        currencies: ['USD', 'EUR'],
    },
};

if (appConfig.useTestnet) {
    appConfig.apollo.providers = appConfig.testnet.providers;
    appConfig.explorerUrl = appConfig.testnet.explorerUrl;
}

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
