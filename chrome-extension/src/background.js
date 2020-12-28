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

const requiresLatestMethods = [ // requires block number as 2th param
    'eth_call',
    'eth_getBalance',
    'eth_getTransactionCount',
    'eth_getCode',
];

const popupManager = new PopupManager();
let sendTransactionRequestCounter = 0;
let sendTransactionRequests = {};
let accountsChangedCallbacks = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.method === 'wallet_init') { // internal, called by inpage on page load
        sendResponse(appConfig.chainId); // in hex
    }
    else if (request.method === 'wallet_sendTransaction_ready' && sender.origin === window.origin) { // from EipSendTransaction
        sendResponse(sendTransactionRequests[request.id].request);
    }
    else if (request.method === 'wallet_sendTransaction_done' && sender.origin === window.origin) { // from EipSendTransaction
        console.log('wallet_sendTransaction_done', request);
        sendTransactionRequests[request.stid].sendResponse(
            { 'jsonrpc': '2.0', 'id': sendTransactionRequests[request.stid].request.id, 'result': request.response }
        );
        delete sendTransactionRequests[request.stid];
    }
    else if (request.method === 'wallet_requestAccounts_done' && sender.origin === window.origin) { // from EipSelectAccounts
        console.log('wallet_requestAccounts_done', request);
        handleAccountsChanged(request.origin, request.accounts);
    }

    // implementation of Ethereum RPC API: https://eth.wiki/json-rpc/API#json-rpc-methods
    // and EIP-1102: Opt-in account exposure: https://eips.ethereum.org/EIPS/eip-1102

    else if (request.method === 'eth_accounts' || request.method === 'eth_requestAccounts') { // list of addresses owned by client
        console.log(request.method, request);
        getAccounts(sender.origin, (accounts, haveAccounts) => {
            if (accounts.length === 0 || request.method === 'eth_requestAccounts') {
                if (haveAccounts) { // select accounts from already opened accounts
                    popupManager.goto('app/index.html#/eip-select-accounts/' + encodeURIComponent(sender.origin));
                } else { // need to add new account
                    popupManager.goto('app/index.html');
                }

                if (!accountsChangedCallbacks[sender.origin]) accountsChangedCallbacks[sender.origin] = [];
                accountsChangedCallbacks[sender.origin].push((accounts) => {
                    sendResponse({ 'jsonrpc': '2.0', 'id': request.id, 'result': accounts });
                });
            } else {
                sendResponse({ 'jsonrpc': '2.0', 'id': request.id, 'result': accounts.map((account) => account.address) });
            }
        });
        return true;
    }

    else if (request.method === 'net_version') { // current network id (decimal string)
        sendResponse({ jsonrpc: '2.0', id: request.id, result: parseInt(appConfig.chainId).toString() });
    }

    else if (request.method === 'eth_sendTransaction') {
        console.log('eth_sendTransaction', request);
        getAccounts(sender.origin, (accounts) => {
            let from = request.params[0].from.toLowerCase();
            if (accounts.filter((account) => account.address.toLowerCase() === from).length === 0) {
                sendResponse({ 'jsonrpc':'2.0', 'id': request.id, 'error':
                        { 'code': errorCodes.invalidParams, 'message': 'Invalid parameters: unauthorized "from" address: ' + from }
                });
                return;
            }

            let stid = ++sendTransactionRequestCounter;
            sendTransactionRequests[stid] = { request, sendResponse };
            popupManager.goto('app/index.html#/eip-send-transaction/' + stid);

        });
        return true;
    }

    else if (proxiedMethods.includes(request.method)) {
        if (requiresLatestMethods.includes(request.method) && !request.params[1]) {
            request.params[1] = 'latest';
        }
        sendToRpc({
            jsonrpc: '2.0',
            id: request.id || 0, // requests without id are ignored
            method: request.method,
            params: request.params,
        }).then(response => {
            console.log('sendToRpc', request, response);
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

    forEachTab(function(tab, origin) {
        let oldAccounts = getAccountsFromState(origin, change.oldValue).map((account) => account.address);
        let newAccounts = getAccountsFromState(origin, change.newValue).map((account) => account.address);

        if (!arrayEquals(oldAccounts, newAccounts)) {
            console.log('wallet_accountsChanged', origin, change);
            chrome.tabs.sendMessage(tab.id, { method: 'wallet_accountsChanged', result: newAccounts });
            handleAccountsChanged(origin, newAccounts);
        }
    });
});

function forEachTab(callback) {
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            if (!tab.url) return;
            let origin = (new URL(tab.url)).origin;
            callback(tab, origin);
        });
    });
}

function handleAccountsChanged(origin, accountIds) {
    if (accountsChangedCallbacks[origin]) {
        accountsChangedCallbacks[origin].forEach((callback) => callback(accountIds));
        delete accountsChangedCallbacks[origin];
    }
}

function getAccounts(origin, callback) {
    getState((state) => {
        callback(getAccountsFromState(origin, state), state.accounts && state.accounts.length > 0);
    });
}

function getAccountsFromState(origin, state) {
    if (state && state.accounts) {
        return state.accounts.filter((account) => account.sites && account.sites.includes(origin));
    } else {
        return [];
    }
}

function getState(callback) {
    chrome.storage.local.get([STORAGE_KEY], (data) => callback(data[STORAGE_KEY] || {}));
}

async function sendToRpc(request) {
    console.log(appConfig.rpc, request);
    return fetch(appConfig.rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    }).then((response) => response.json())
        .catch((ex) => {
            return { 'jsonrpc':'2.0', 'id': request.id, 'error':
                    { 'code': errorCodes.internal, 'message': 'RPC error: ' + ex }};
        });
}

console.log('background page loaded');
