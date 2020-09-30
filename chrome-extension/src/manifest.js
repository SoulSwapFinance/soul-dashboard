/* Generates manifest.json file. */

const fs = require('fs');
const path = require('path');
const appConfig = require('../../app.config.js');

const chromeExtensionManifest = {
    permissions: ['activeTab', 'declarativeContent', 'storage', 'https://*/'],
    background: {
        scripts: [`${appConfig.chromeExtension.outputDirBackgroundJs}/background.umd.min.js`],
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
        default_popup: 'app/index.html',
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

const inpage = fs.readFileSync(path.resolve(__dirname, 'inpage.js'));
const contentscript = fs.readFileSync(path.resolve(__dirname, 'contentscript.js'));
const inpageEscaped = "const INPAGE_SCRIPT = '" + escapeJs(inpage) + "';\n";

fs.writeFileSync(
    path.resolve(__dirname, '../../', `${appConfig.chromeExtension.outputDir}/contentscript.js`),
    inpageEscaped + contentscript
);

function escapeJs(string) {
  return ('' + string).replace(/["'\\\n\r\u2028\u2029]/g, function (character) {
    // Escape all characters not included in SingleStringCharacters and
    // DoubleStringCharacters on
    // http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
    switch (character) {
      case '"':
      case "'":
      case '\\':
        return '\\' + character
      // Four possible LineTerminator characters need to be escaped:
      case '\n':
        return '\\n'
      case '\r':
        return '\\r'
      case '\u2028':
        return '\\u2028'
      case '\u2029':
        return '\\u2029'
    }
  })
}

