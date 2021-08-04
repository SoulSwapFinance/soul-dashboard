const appConfig = require('./app.config.js');
const path = require('path');
const svgFilePath = path.join(__dirname, './src/assets/svg');

console.log('--- app config ---');
console.log(appConfig);

module.exports = {
    // lintOnSave: false,

    publicPath: '',
    outputDir: appConfig.build.outputDir,

    transpileDependencies: ['fantom-ledgerjs'],

    devServer: {
        https: false,
    },

    css: {
        loaderOptions: {
            scss: {
                prependData: appConfig.scssData,
            },
        },
    },

    pwa: {
        name: appConfig.pwa.name,
        themeColor: '#C8A2C8',
        msTileColor: '#C8A2C8',
        assetsVersion: '4',
        manifestOptions: {
            background_color: '#C8A2C8',
            categories: appConfig.pwa.categories,
        },
        workboxOptions: {
            skipWaiting: true,
        },
    },

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: false,
        },
    },

    chainWebpack: (config) => {
        // sets page title
        config.plugin('html').tap((_args) => {
            _args[0].title = appConfig.name;
            _args[0].description = appConfig.description;
            _args[0].keywords = appConfig.keywords;

            delete _args[0].minify;

            return _args;
        });

        config.module
            .rule('vue-svgicon')
            .test(/\.svg$/)
            .use('svgicon')
            .loader('@yzfe/vue-svgicon-loader')
            .options({
                idSeparator: '_',
                svgFilePath,
            });

        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap((options) => {
                options.transformAssetUrls = options.transformAssetUrls || {};
                options.transformAssetUrls['icon'] = ['data'];
                return options;
            });

        config.module.rule('svg').exclude.add(svgFilePath);

        config.resolve.alias.set('@icon', svgFilePath);

        config.resolve.symlinks(false);

        if (!appConfig.usePWA) {
            config.plugins.delete('pwa');
            config.plugins.delete('workbox');
        }
    },
};
