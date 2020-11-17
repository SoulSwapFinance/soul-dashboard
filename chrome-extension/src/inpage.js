'use strict';

/**
 * Simplified implementation of EventEmitter
 */
class FantomEventEmitter {

    events = {};

    emit (type) {
        var listeners, args = [].slice.call(arguments, 1);
        if (typeof this.events[type] === 'object') {
            listeners = this.events[type].slice();
            for (var i = 0; i < listeners.length; i++) {
                listeners[i].apply(this, args);
            }
        } else if (type === 'error') {
            var er;
            if (args.length > 0)
                er = args[0];
            if (er instanceof Error) {
                throw args[0];
            } else {
                var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
                err.context = er;
                throw err;
            }
        }
    }

    _addListener (type, listener, prepend) {
        if (typeof this.events[type] !== 'object') {
            this.events[type] = [];
        }
        this.emit('newListener', type, listener);
        if (prepend) {
            this.events[type].unshift(listener);
        } else {
            this.events[type].push(listener);
        }
        return this;
    }

    addListener (type, listener) {
        return this._addListener(type, listener, false);
    }

    on (type, listener) {
        return this._addListener(type, listener, false);
    }

    prependListener (type, listener) {
        return this._addListener(type, listener, true);
    }

    once (type, handler) {
        return this._addListener(type, function g () {
            this.removeListener(type, g);
            handler.apply(this, arguments);
        }, false);
    }

    prependOnceListener (type, handler) {
        return this._addListener(type, function g () {
            this.removeListener(type, g);
            handler.apply(this, arguments);
        }, true);
    }

    removeListener (type, listener) {
        if (typeof this.events[type] === 'object') {
            var idx = this.events[type].indexOf(listener);
            if (idx > -1) {
                this.events[type].splice(idx, 1);
                this.emit('removeListener', type, listener);
            }
        }
        return this;
    }

    off (type, listener) {
        return removeListener(type, listener);
    }

    removeAllListeners (type) {
        if (typeof this.events[type] === 'object') {
            var listeners = this.events[type];
            for (var i = 0; i < listeners.length; i++) {
                listeners[i].apply(this, args);
                this.emit('removeListener', type, listener);
            }
            delete this.events[type];
        }
        return this;
    }

    listeners (type) {
        if (typeof this.events[type] === 'object') {
            return this.events[type].slice();
        } else {
            return [];
        }
    }
}

/**
 * Implementation of EIP-1193 provider
 */
class FantomInpageProvider extends FantomEventEmitter {

    _messageCounter = Math.floor(Math.random() * 4294967295);
    _isConnected = false;
    chainId = undefined;
    debug = false;
    messageCallbacks = {};

    constructor () {
        super();

        this.on('connect', () => {
            this._isConnected = true
        });

        setTimeout(() => this.emit('connect', { chainId: this.chainId }));

        this._sendToContentScript({ method: 'wallet_init'}, (error, result) => {
            this.chainId = result;
            this.emit('chainChanged', this.chainId);
        });

        // bind functions (fix unbound calls)
        this.request = this.request.bind(this)
        this.sendAsync = this.sendAsync.bind(this)
        this.enable = this.enable.bind(this)
    }

    /**
     * Returns whether the provider can make RPC requests to the current chain.
     */
    isConnected () {
        return this._isConnected
    }

    get isMetaMask() {
        return false;
    }

    /**
     * Submits an RPC request to MetaMask for the given method, with the given params.
     * Resolves with the result of the method call, or rejects on error.
     *
     * @param {Object} args - The RPC request arguments.
     * @param {string} args.method - The RPC method name.
     * @param {unknown[] | Object} [args.params] - The parameters for the RPC method.
     * @returns {Promise<unknown>} A Promise that resolves with the result of the RPC method,
     * or rejects if an error is encountered.
     */
    async request (args) {
        const { method, params } = args

        return new Promise((resolve, reject) => {
            try {
                this._rpcRequest(
                    {method, params},
                    (error, response) => {
                        if (error || response.error) {
                            reject(error || response.error)
                        } else {
                            Array.isArray(response)
                                ? resolve(response)
                                : resolve(response.result)
                        }
                    },
                );
            } catch (error) {
                reject(error);
            }
        })
    }

    /**
     * DEPRECATED.
     * Use ethereum.request() instead.
     *
     * Submit a JSON-RPC request object and a callback to make an RPC method call.
     *
     * @param {Object} payload - The RPC request object.
     * @param {Function} callback - The callback function.
     */
    sendAsync (payload, cb) {
        this._rpcRequest(payload, cb)
    }

    /**
     * DEPRECATED.
     * Equivalent to: ethereum.request('eth_requestAccounts')
     *
     * @returns {Promise<Array<string>>} - A promise that resolves to an array of addresses.
     */
    enable () {
        return this.request({ method: 'eth_requestAccounts' });
    }

    /**
     * Internal RPC method. Forwards requests to background via the RPC engine.
     *
     * @param {Object} payload - The RPC request object.
     * @param {Function} callback - The consumer's callback.
     * @param {boolean} isInternal - Whether the request is internal.
     */
    _rpcRequest (payload, callback, isInternal = false) {
        let cb = callback
        if (!Array.isArray(payload)) {
            if (!payload.jsonrpc) {
                payload.jsonrpc = '2.0'
            }

            // handle accounts changing
            if (
                payload.method === 'eth_accounts' ||
                payload.method === 'eth_requestAccounts'
            ) {
                cb = (err, res) => {
                    this._handleAccountsChanged(
                        res.result || [],
                        payload.method === 'eth_accounts',
                        isInternal,
                    )
                    callback(err, res)
                }
            }
        }
        this._sendToContentScript(payload, cb)
    }

    _getMessageId() {
        this._messageCounter = (this._messageCounter + 1) % 4294967295;
        return '' + this._messageCounter;
    }

    _sendToContentScript(payload, callback = null) {
        let id = this._getMessageId();
        if (callback) this.messageCallbacks[id] = callback;
        if (this.debug) console.log('FantomPwaWallet request', id, payload);
        window.postMessage({
            target: 'FantomPWAwalletBackground',
            data: payload,
            msgId: id,
        }, location.origin);
    }

    _receiveFromContentScript(event) {
        let msg = event.data
        if (event.origin !== location.origin) return
        if (event.source !== window) return
        if (typeof msg !== 'object') return
        if (msg.target !== 'FantomPWAwalletInpage') return
        if (!msg.data) return
        let data = msg.data;

        if (this.debug) console.log('FantomPwaWallet response', msg.msgId, data);

        if (msg.msgId && typeof this.messageCallbacks[msg.msgId] !== 'undefined') {
            let callback = this.messageCallbacks[msg.msgId];
            delete this.messageCallbacks[msg.msgId];
            if (data.error) {
                console.log('FantomPwaWallet RPC error', data);
                callback(data.error, null); // (error, result)
            } else {
                callback(null, data); // (error, result)
            }
            if (this.debug) console.log('FantomPwaWallet response callback called', msg.msgId, data);
        }

        if (data.method === 'wallet_accountsChanged') {
            this._handleAccountsChanged(data.result);
        }
        if (data.method === 'eth_subscription') {
            this.emit('message', {
                type: 'eth_subscription',
                data: data.params,
            });
        }
    }

    /**
     * Called when accounts may have changed. Diffs the new accounts value with
     * the current one, updates all state as necessary, and emits the
     * accountsChanged event.
     *
     * @param {string[]} accounts - The new accounts value.
     * @param {boolean} isEthAccounts - Whether the accounts value was returned by
     * a call to eth_accounts.
     * @param {boolean} isInternal - Whether the accounts value was returned by an
     * internally initiated request.
     */
    _handleAccountsChanged (accounts, isEthAccounts = false, isInternal = false) {
        if (this.debug) console.log('FantomPwaWallet accountsChanged', accounts);
        this.emit('accountsChanged', accounts)
    }
}

window.ethereum = new FantomInpageProvider();
window.web3 = { currentProvider: window.ethereum }; // for old Metamask compatibility
window.addEventListener("message", function (event) {
    window.ethereum._receiveFromContentScript(event);
});
window.dispatchEvent(new Event('ethereum#initialized'));
console.log("Fantom-PWA-Wallet initialized");
