import appConfig from '../../app.config.js';
/* global chrome */

class Storage {
    getItem(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key, (result) => {
                if (chrome.runtime.lastError) {
                    console.error('Storage.getItem', chrome.runtime.lastError.message);
                    reject(chrome.runtime.lastError.message);
                } else {
                    resolve(result[key]);
                }
            });
        });
    }
    setItem(key, data) {
        return chrome.storage.local.set({ [key]: data });
    }
    removeItem(key) {
        return chrome.storage.local.remove(key);
    }
    clear() {
        return chrome.storage.local.clear();
    }
    get length() {
        throw new Error('Not implemented method');
    }
    key() {
        throw new Error('Not implemented method');
    }
}

export default appConfig.isChromeExtension
    ? {
          storage: new Storage(),
          asyncStorage: true,
      }
    : {
          storage: window.localStorage,
          asyncStorage: false,
      };
