/* Generates manifest.json file. */

const fs = require('fs');
const path = require('path');
const appConfig = require('../app.config.js');

const chromeExtensionManifest = {
    permissions: [
        'activeTab',
        'declarativeContent',
        'storage',
        'https://*/'
    ],
    background: {
        scripts: [
            'background.js'
        ],
        persistent: false
    },
    icons: {
        '48': 'app/favicon.png'
    },
    browser_action: {
        default_popup: 'app/index.html',
        default_icon: {
            '48': 'app/favicon.png'
        }
    },
    'manifest_version': 2
};

chromeExtensionManifest.name = appConfig.chromeExtension.name;
chromeExtensionManifest.version = appConfig.chromeExtension.version;
chromeExtensionManifest.description = appConfig.chromeExtension.description;

fs.writeFileSync(path.resolve(__dirname, 'manifest.json'), JSON.stringify(chromeExtensionManifest));

