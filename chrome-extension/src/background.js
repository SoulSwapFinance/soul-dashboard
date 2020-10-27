'use strict';
/* global chrome */

import PopupManager from './popup';
import appConfig from '../../app.config';
import { arrayEquals } from '@/utils/array';

const STORAGE_KEY = 'vuex';

const errorCodes = {
    invalidInput: -32000,
    resourceNotFound: -32001,
    resourceUnavailable: -32002,
    transactionRejected: -32003,
    methodNotSupported: -32004,
    parse: -32700,
    invalidRequest: -32600,
    methodNotFound: -32601,
    invalidParams: -32602,
    internal: -32603
};

const proxiedMethods = [
    'eth_gasPrice',
    'eth_blockNumber',
    'eth_getBalance',
    'eth_getStorageAt',
    'eth_getTransactionCount',
    'eth_getBlockTransactionCountByHash',
    'eth_getBlockTransactionCountByNumber',
    'eth_getUncleCountByBlockHash',
    'eth_getUncleCountByBlockNumber',
    'eth_getCode',
    'eth_call',
    'eth_estimateGas',
    'eth_getBlockByHash',
    'eth_getBlockByNumber',
    'eth_getTransactionByHash',
    'eth_getTransactionByBlockHashAndIndex',
    'eth_getTransactionByBlockNumberAndIndex',
    'eth_getTransactionReceipt',
    'eth_getUncleByBlockHashAndIndex',
    'eth_getUncleByBlockNumberAndIndex',
];

const popupManager = new PopupManager();
let sendTransactionRequestCounter = 0;
let sendTransactionRequests = {};
let sendTransactionResponseCallbacks = {};
let accountsChangedCallbacks = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.method === 'wallet_init') { // internal, called by inpage on page load
        sendResponse(appConfig.chainId); // in hex
    }
    else if (request.method === 'wallet_sendTransaction_ready' && sender.origin === window.origin) { // from popup
        sendResponse(sendTransactionRequests[request.id]);
    }
    else if (request.method === 'wallet_sendTransaction_done' && sender.origin === window.origin) { // from popup
        console.log('wallet_sendTransaction_done', request);
        sendTransactionResponseCallbacks[request.stid]({ 'jsonrpc': '2.0', 'id': sendTransactionRequests[request.stid].id, 'result': request.response });
        delete sendTransactionRequests[request.stid];
        delete sendTransactionResponseCallbacks[request.stid];
    }

    // implementation of Ethereum RPC API: https://eth.wiki/json-rpc/API#json-rpc-methods
    // and EIP-1102: Opt-in account exposure: https://eips.ethereum.org/EIPS/eip-1102

    else if (request.method === 'eth_accounts') { // get list of addresses owned by client
        getState((state) => {
            sendResponse({ 'jsonrpc': '2.0', 'id': request.id, 'result': accountsIds(state) });
        });
        return true;
    }

    else if (request.method === 'eth_requestAccounts') { // trigger user interface to get account access
        getState((state) => {
            if (state.accounts) {
                sendResponse({ 'jsonrpc': '2.0', 'id': request.id, 'result': accountsIds(state) });
            } else {
                popupManager.showPopup('app/index.html');
                accountsChangedCallbacks.push((state) => {
                    sendResponse({ 'jsonrpc': '2.0', 'id': request.id, 'result': accountsIds(state) });
                });
            }
        });
        return true;
    }

    else if (request.method === 'net_version') { // current network id (decimal string)
        sendResponse({ jsonrpc: '2.0', id: request.id, result: parseInt(appConfig.chainId).toString() });
    }

    else if (request.method === 'eth_sendTransaction') {
        console.log('eth_sendTransaction', request);
        let stid = ++sendTransactionRequestCounter;
        sendTransactionRequests[stid] = request;
        sendTransactionResponseCallbacks[stid] = sendResponse;
        popupManager.showPopup('app/index.html#/eip-send-transaction/' + stid);
        return true;
    }

    else if (proxiedMethods.includes(request.method)) {
        sendToRpc({
            jsonrpc: '2.0',
            id: request.id,
            method: request.method,
            params: request.params,
        }).then(response => {
            console.log('eth_getTransactionReceipt', request, response);
            sendResponse(response);
        });
        return true;
    }

    else {
        console.log('Unsupported method', request);
        sendResponse({ 'jsonrpc':'2.0', 'id': request.id, 'error':
                { 'code': errorCodes.methodNotFound, 'message': 'the method ' + request.method + ' does not exist/is not available' }
        });
    }
});

chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName !== 'local' || !(STORAGE_KEY in changes)) return;
    let change = changes[STORAGE_KEY];

    console.log('state changed', change);

    // accountsChanged event
    let oldAccountsIds = accountsIds(change.oldValue);
    let newAccountsIds = accountsIds(change.newValue);
    if (!arrayEquals(oldAccountsIds, newAccountsIds)) {
        console.log('wallet_accountsChanged', change);
        broadcastMessage({ method: 'wallet_accountsChanged', result: newAccountsIds });
        accountsChangedCallbacks.forEach((callback) => callback(change.newValue));
        accountsChangedCallbacks.length = 0;
    }
});

function getState(callback) {
    chrome.storage.local.get([STORAGE_KEY], (data) => callback(data[STORAGE_KEY] || {}));
}

function accountsIds(state) {
    let result = [];
    if (state && state.accounts) {
        state.accounts.forEach((account) => result.push(account.address));
    }
    return result;
}

async function sendToRpc(request) {
    return fetch(appConfig.chromeExtension.rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    }).then((response) => response.json());
}

function broadcastMessage(payload) {
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.tabs.sendMessage(tab.id, payload);
        });
    });
}

console.log('background page loaded');
