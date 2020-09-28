// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// import 'assert';

// eslint-disable-next-line no-undef
chrome.runtime.onInstalled.addListener(function () {
    /*
      chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'developer.chrome.com'},
          })
          ],
          actions: [new chrome.declarativeContent.ShowBrowserAction()]
        }]);
      });
    */
});

// mock for demo
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    console.log(request, sender);
    //sender.origin = "http://www.example.com"
    //sender.url = "http://www.example.com/test.htm"

    if (request.method === 'wallet_init') { // internal, called by inpage on page load
        sendResponse({ method: 'wallet_chainIdChanged', result:"0xf3" });
    }

    else if (request.method === 'eth_accounts') {
        showPopup();
        sendResponse({"jsonrpc":"2.0","id":request.id,"result":[
            "0x83A6524Be9213B1Ce36bCc0DCEfb5eb51D87aD10",
            "0x51A6524Be9213B1Ce36bCc0DCEfb5eb51D87aD12",
            ]});
    } else if (request.method === 'eth_getBalance') {
        sendResponse({"jsonrpc":"2.0","id":request.id,"result":"0x3728019d78a47600"}); // 3.974428447 FTM
    } else if (request.method === 'net_version') {
        sendResponse({"jsonrpc":"2.0","id":request.id,"result":250}); // Fantom mainnet
    } else {
        sendResponse({"jsonrpc":"2.0","id":request.id,"error":{"code":-32601,"message":"the method "+request.method+" does not exist/is not available"}});
    }

});

function broadcastMessage(payload) {
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.tabs.sendMessage(tab.id, payload);
        });
    });
}

// call when chain/account switched in extension UI
broadcastMessage({ method: 'wallet_chainIdChanged', result:"0xf3" });
broadcastMessage({ method: 'wallet_accountsChanged', result:"0x83A6524Be9213B1Ce36bCc0DCEfb5eb51D87aD10" });

function showPopup() {
    chrome.windows.create({
        url: 'app/index.html',
        type: 'popup',
        width: 450,
        height: 620,
        left: 0,
        top: 0,
    }, (newWindow) => {

    });
}
