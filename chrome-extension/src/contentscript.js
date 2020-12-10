'use strict';
/* global chrome */

if (shouldInjectProvider()) {
    injectScriptFile('inpage.js');
}

/**
 * Injects a script tag into the current document
 *
 * @param {string} url - Url of script to be executed in the current document
 */
function injectScriptFile(url) {
    try {
        const container = document.head || document.documentElement;
        const scriptTag = document.createElement('script');
        scriptTag.src = chrome.extension.getURL(url);
        container.insertBefore(scriptTag, container.children[0]);
        container.removeChild(scriptTag);
    } catch (e) {
        console.error('Fantom-PWA-Wallet inpage injection failed.', e);
    }
}

/**
 * Determines if the provider should be injected
 *
 * @returns {boolean} {@code true} - if the provider should be injected
 */
function shouldInjectProvider() {
    return doctypeCheck() && suffixCheck() && documentElementCheck()
}

/**
 * Checks the doctype of the current document if it exists
 *
 * @returns {boolean} {@code true} - if the doctype is html or if none exists
 */
function doctypeCheck () {
    const doctype = window.document.doctype
    if (doctype) {
        return doctype.name === 'html'
    } else {
        return true;
    }
}

/**
 * Returns whether or not the extension (suffix) of the current document is prohibited
 *
 * This checks {@code window.location.pathname} against a set of file extensions
 * that we should not inject the provider into. This check is indifferent of
 * query parameters in the location.
 *
 * @returns {boolean} - whether or not the extension of the current document is prohibited
 */
function suffixCheck() {
    const prohibitedTypes = [
        /\.xml$/,
        /\.pdf$/,
    ]
    const currentUrl = window.location.pathname;
    for (let i = 0; i < prohibitedTypes.length; i++) {
        if (prohibitedTypes[i].test(currentUrl)) {
            return false;
        }
    }
    return true;
}

/**
 * Checks the documentElement of the current document
 *
 * @returns {boolean} {@code true} - if the documentElement is an html node or if none exists
 */
function documentElementCheck() {
    const documentElement = document.documentElement.nodeName;
    if (documentElement) {
        return documentElement.toLowerCase() === 'html';
    }
    return true;
}

function sendToInpage() {
    window.postMessage({
        target: 'FantomPWAwalletInpage',
        data: data,
    }, location.origin);
}

// inpage -> background + callback
window.addEventListener('message', function(event) {
    var msg = event.data
    if (event.origin !== location.origin) return
    if (event.source !== window) return
    if (typeof msg !== 'object') return
    if (msg.target !== 'FantomPWAwalletBackground') return
    if (!msg.data) return

    chrome.runtime.sendMessage(msg.data, function(response) {
        window.postMessage({
            target: 'FantomPWAwalletInpage',
            data: response,
            msgId: msg.msgId
        }, location.origin);
    });
}, false);

// background -> inpage
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    window.postMessage({
        target: 'FantomPWAwalletInpage',
        data: request,
    }, location.origin);
});
