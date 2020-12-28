/* Generates manifest.json file. */

const fs = require('fs');
const path = require('path');
const appConfig = require('../../app.config.js');

const chromeExtensionManifest = {
    permissions: ['activeTab', 'tabs', 'declarativeContent', 'storage', 'https://*/'],
    background: {
        scripts: [`${appConfig.chromeExtension.outputDirBackgroundJs}/background.umd.js`],
        persistent: false,
    },
    content_scripts: [
        {
            matches: [
                "file://*/*",
                "http://*/*",
                "https://*/*"
            ],
            js: [
                "contentscript.js"
            ],
            run_at: "document_start",
            all_frames: true
        }
    ],
    web_accessible_resources: [
        'inpage.js'
    ],
    icons: {
        '48': 'app/favicon.png',
    },
    browser_action: {
        default_popup: 'app/index.html#/eip-select-accounts/popup',
        default_icon: {
            '48': 'app/favicon.png',
        },
    },
    manifest_version: 2,
};

chromeExtensionManifest.name = appConfig.chromeExtension.name;
chromeExtensionManifest.version = appConfig.chromeExtension.version;
chromeExtensionManifest.description = appConfig.chromeExtension.description;

fs.writeFileSync(
    path.resolve(__dirname, '../../', `${appConfig.chromeExtension.outputDir}/manifest.json`),
    JSON.stringify(chromeExtensionManifest)
);

fs.copyFileSync(
    path.resolve(__dirname, 'contentscript.js'),
    path.resolve(__dirname, '../../', `${appConfig.chromeExtension.outputDir}/contentscript.js`),
);

fs.copyFileSync(
    path.resolve(__dirname, 'inpage.js'),
    path.resolve(__dirname, '../../', `${appConfig.chromeExtension.outputDir}/inpage.js`),
);
