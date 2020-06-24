// import Bip39 from 'bip39';
import fileDownload from 'js-file-download';
import gql from 'graphql-tag';
import web3utils from 'web3-utils';
import Accounts from 'web3-eth-accounts';

const bip39 = require('bip39');
const Hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
// const strongPasswordRE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
const strongPasswordRE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?=.{8,})/;
const mnemonicRE = /^[ a-z]+$/;

export const FANTOM_CHAIN_ID = 0xfa;

export const GAS_LIMITS = {
    default: '0xabe0',
    claimRewards: '0x3D0900',
    undelegate: '0x30D40',
    withdraw: '0x30D40',
    delegate: '0x30D40',
    ballot: '0x3D0900',
};

/** @type {FantomWeb3Wallet} */
export let fWallet = null;

export const Web3 = {
    utils: web3utils,
    accounts: new Accounts(),
};

// Fantom web3 wallet plugin for VUE, based on https://git`hub.com/Fantom-foundation/fantom-web3-wallet
export class FantomWeb3Wallet {
    static install(_Vue, _options) {
        fWallet = new FantomWeb3Wallet(_options);
        _Vue.prototype.$fWallet = fWallet;
    }

    constructor(_options) {
        this.apolloClient = _options.apolloClient;
    }

    /**
     * @param {String} [_to]
     * @return {Promise<Number>}
     */
    async getTokenPrice(_to = 'USD') {
        const data = await this.apolloClient.query({
            query: gql`
                query Price($to: String!) {
                    price(to: $to) {
                        price
                    }
                }
            `,
            variables: {
                to: _to,
            },
            fetchPolicy: 'no-cache',
        });

        if (!data.data.price) {
            return;
        }

        let tokenPrice = parseFloat(data.data.price.price);

        tokenPrice = parseInt(tokenPrice * 100000) / 100000;

        return tokenPrice;
    }

    /**
     * Get balance and total balance of account by address.
     *
     * @param {String} _address
     * @param {Boolean} [_withDelegations] Include delegations and staker info.
     * @param {Boolean} [_justBalance]
     * @return {Promise<{totalValue: string, address: string, balance: string}>}
     */
    async getBalance(_address, _withDelegations, _justBalance) {
        let query = gql`
            query AccountByAddress($address: Address!) {
                account(address: $address) {
                    address
                    balance
                    totalValue
                    delegation {
                        pendingRewards {
                            amount
                        }
                    }
                }
            }
        `;

        if (_justBalance) {
            query = gql`
                query AccountByAddress($address: Address!) {
                    account(address: $address) {
                        address
                        balance
                        delegation {
                            pendingRewards {
                                amount
                            }
                        }
                    }
                }
            `;
        } else if (_withDelegations) {
            query = gql`
                query AccountByAddress($address: Address!) {
                    account(address: $address) {
                        address
                        balance
                        stashed
                        canUnStash
                        totalValue
                        staker {
                            id
                            createdTime
                            isActive
                        }
                        delegation {
                            toStakerId
                            createdEpoch
                            createdTime
                            deactivatedEpoch
                            deactivatedTime
                            amount
                            amountDelegated
                            amountInWithdraw
                            claimedReward
                            pendingRewards {
                                amount
                                fromEpoch
                                toEpoch
                            }
                            withdrawRequests {
                                address
                                receiver
                                account {
                                    address
                                }
                                stakerID
                                withdrawRequestID
                                isDelegation
                                amount
                                withdrawPenalty
                                requestBlock {
                                    number
                                    timestamp
                                }
                                withdrawBlock {
                                    number
                                    timestamp
                                }
                            }
                            deactivation {
                                address
                                requestBlock {
                                    number
                                    timestamp
                                }
                                withdrawBlock {
                                    number
                                    timestamp
                                }
                            }
                        }
                    }
                }
            `;
        }

        const data = await this.apolloClient.query({
            query,
            variables: {
                address: _address,
            },
            fetchPolicy: 'no-cache',
        });

        return data.data.account;
    }

    /**
     * @param {Boolean} [_inHexFormat]
     * @return {Promise<*>}
     */
    async getGasPrice(_inHexFormat) {
        const data = await this.apolloClient.query({
            query: gql`
                query GasPrice {
                    gasPrice
                }
            `,
        });

        return _inHexFormat ? data.data.gasPrice : parseInt(data.data.gasPrice);
    }

    /**
     * Get account transaction count by address.
     *
     * @param {String} _address
     * @param {Boolean} [_inHexFormat]
     * @return {Promise<string>}
     */
    async getTransactionCount(_address, _inHexFormat) {
        const data = await this.apolloClient.query({
            query: gql`
                query AccountByAddress($address: Address!) {
                    account(address: $address) {
                        txCount
                    }
                }
            `,
            variables: {
                address: _address,
            },
            fetchPolicy: 'no-cache',
        });

        return _inHexFormat ? data.data.account.txCount : parseInt(data.data.account.txCount);
    }

    /**
     * Get balance and total balance of account by address.
     *
     * @param {String} _address
     * @param {Boolean} [_withDelegations] Include delegations and staker info.
     * @return {Promise<{totalValue: string, address: string, balance: string}>}
     */
    async getStakerById(_id) {
        const data = await this.apolloClient.query({
            query: gql`
                query StakerById($id: Long!) {
                    staker(id: $id) {
                        id
                        stakerAddress
                        totalStake
                        stake
                        delegatedMe
                        totalDelegatedLimit
                        delegatedLimit
                        createdEpoch
                        createdTime
                        validationScore
                        downtime
                        isActive
                        isOffline
                        stakerInfo {
                            name
                            website
                            contact
                            logoUrl
                        }
                    }
                }
            `,
            variables: {
                id: _id,
            },
            fetchPolicy: 'no-cache',
        });

        return data.data.staker;
    }

    /**
     * Convert WEI to FTM.
     *
     * @param {String|Number|BN} _value
     * @return {String|BN}
     */
    WEIToFTM(_value) {
        return Web3.utils.fromWei(_value, 'ether');
    }

    /**
     * Are addresses the same?
     *
     * @param {String} _address1
     * @param {String} _address2
     * @return {boolean}
     */
    sameAddresses(_address1, _address2) {
        return _address1.toLowerCase() === _address2.toLowerCase();
    }

    /**
     * @param {String} _privateKey
     * @return {Account}
     */
    restoreAccountByPrivateKey(_privateKey) {
        return Web3.accounts.privateKeyToAccount(_privateKey);
    }

    /**
     * @param {String} _privateKey
     * @param {String} _password
     * @return {EncryptedKeystoreV3Json}
     */
    encryptToKeystore(_privateKey, _password) {
        return Web3.accounts.encrypt(_privateKey, _password);
    }

    /**
     * @param {Object} _keystoreJsonV3
     * @param {String} _password
     * @return {Account}
     */
    decryptFromKeystore(_keystoreJsonV3, _password) {
        return Web3.accounts.decrypt(_keystoreJsonV3, _password);
    }

    /**
     * @param {String} _publicAddress
     * @return {String}
     */
    getKeystoreFileName(_publicAddress) {
        return `UTC--${new Date().toISOString()} -- ${_publicAddress}`;
    }

    /**
     * @param {Object} _keystoreJsonV3
     */
    downloadKeystore(_keystoreJsonV3) {
        fileDownload(
            JSON.stringify(_keystoreJsonV3),
            `${this.getKeystoreFileName(this.toChecksumAddress(_keystoreJsonV3.address))}.json`
        );
    }

    /**
     * @return {Account}
     */
    createAccount() {
        return Web3.accounts.create();
    }

    /**
     * @param {String} _address
     * @return {String}
     */
    toChecksumAddress(_address) {
        return Web3.utils.toChecksumAddress(_address);
    }

    /**
     * @param {String} _pwd
     * @return {Boolean}
     */
    checkPrimaryPassword(_pwd) {
        return strongPasswordRE.test(_pwd) && _pwd.length < 200;
    }

    /**
     * Test and correct mnemonic phrase - must have 12 or 24 words ([a-z]) separated by space
     *
     * @param {String} _mnemonic
     * @return {String} Corrected mnemonic or empty string.
     */
    correctMnemonic(_mnemonic) {
        const mnemT = _mnemonic.trim();
        let mnemonic = '';
        let mnemArr;

        if (mnemonicRE.test(mnemT)) {
            mnemArr = mnemT.split(/\s+/g);
            if (mnemArr.length === 12 || mnemArr.length === 24) {
                mnemonic = mnemArr.join(' ');
            }
        }

        return mnemonic;
    }

    /**
     * Convert mnemonic phrase to public and private key
     *
     * @param {String} _mnemonic
     * @return {Promise<{privateKey: string, publicAddress: string}>}
     */
    async mnemonicToKeys(_mnemonic) {
        const seed = await bip39.mnemonicToSeed(_mnemonic);
        const root = Hdkey.fromMasterSeed(seed);
        const addrNode = root.derive("m/44'/60'/0'/0/0");
        const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
        const addr = ethUtil.publicToAddress(pubKey).toString('hex');
        const publicAddress = ethUtil.toChecksumAddress(addr);
        const privateKey = ethUtil.bufferToHex(addrNode._privateKey);

        return { publicAddress, privateKey };
    }

    /**
     * Create mnemonic phrase and get private key and keystore file.
     *
     * @param {String} _pwd
     * @return {Promise<{privateKey: string, mnemonic: string, keystore: EncryptedKeystoreV3Json}>}
     */
    async createMnemonic(_pwd) {
        const mnemonic = bip39.generateMnemonic(256);
        const { privateKey } = await this.mnemonicToKeys(mnemonic);
        const keystore = this.encryptToKeystore(privateKey, _pwd);

        return { privateKey, mnemonic, keystore };
    }

    async getTransactionToSign({ from, to, value, memo = '', gasLimit = GAS_LIMITS.default }) {
        const nonce = await this.getTransactionCount(from);
        const gasPrice = await this.getGasPrice(true);

        return {
            value: value,
            // from,
            to: to,
            gas: gasLimit,
            gasLimit: gasLimit,
            chainId: FANTOM_CHAIN_ID,
            gasPrice,
            nonce,
            data: memo ? Web3.utils.asciiToHex(memo) : '0x',
        };
    }

    /**
     * @param {Object} _tx SFC transaction object.
     * @param {String} _from Address.
     * @param {String} [_gasLimit] Hex.
     * @return {Promise<{nonce: string, gasPrice: *}>}
     */
    async getSFCTransactionToSign(_tx, _from, _gasLimit = GAS_LIMITS.default) {
        const nonce = await this.getTransactionCount(_from);
        const gasPrice = await this.getGasPrice(true);

        return {
            ..._tx,
            gasPrice,
            gas: _gasLimit,
            gasLimit: _gasLimit,
            nonce,
        };
    }

    async signTransaction(_tx, _keystore, _password) {
        const account = this.decryptFromKeystore(_keystore, _password);

        if (account) {
            const transaction = await account.signTransaction(_tx);

            return transaction.rawTransaction;
        }

        return null;
    }

    /*
    async signTransaction({ from, to, value, memo = '', gasLimit = '44000', keystore, password }) {
        const nonce = await this.getTransactionCount(from);
        const gasPrice = await this.getGasPrice(true);
        const tx = {
            value: value,
            // from,
            to: to,
            gas: gasLimit,
            chainId: FANTOM_CHAIN_ID,
            gasPrice,
            nonce,
            data: memo ? Web3.utils.asciiToHex(memo) : '',
        };

        const account = this.decryptFromKeystore(keystore, password);
        if (account) {
            const transaction = await account.signTransaction(tx);

            return transaction.rawTransaction;
        }

        return null;
    }
    */

    /*
    async estimateFee({ from, to, value, memo }) {
        const { web3 } = this;
        const gasPrice = await this.getGasPrice(true);
        const gasUsed = await web3.eth.estimateGas({
            from,
            to,
            value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
            data: web3.utils.asciiToHex(memo),
        });

        return this.getTransactionFee(gasPrice, gasUsed);

    }

    */

    /**
     * Get instance of BN.
     *
     * @param {*} _number
     * @return {BN}
     */
    toBN(_number) {
        return Web3.utils.toBN(_number);
    }

    /**
     * Split mnemonic phrase.
     *
     * @param {String} _mnemonic
     * @return {Array}
     */
    getMnemonicArray(_mnemonic) {
        return _mnemonic ? _mnemonic.split(/\s+/g) : [];
    }

    /**
     * Get transaction fee in WEI.
     *
     * @param {*} _gasPrice
     * @param {string} _gasLimit
     * @return {BN}
     */
    getTransactionFee(_gasPrice, _gasLimit = GAS_LIMITS.default) {
        // const gasPrice = _gasPrice || await this.getGasPrice(true);
        return this.toBN(_gasPrice).mul(this.toBN(_gasLimit));
    }

    /**
     * Get the remaining balance (in FTM) after deducting transaction fee.
     *
     * @param {*} _balance
     * @param {*} _gasPrice
     * @param {string} _gasLimit
     * @return {number}
     */
    getRemainingBalance(_balance, _gasPrice, _gasLimit) {
        const fee = this.getTransactionFee(_gasPrice, _gasLimit);
        const balance = this.toBN(_balance);

        return parseFloat(this.WEIToFTM(balance.sub(fee.mul(this.toBN(2)))));
    }

    /**
     * Get the remaining balance (in FTM) after deducting transaction fee.
     *
     * @param {*} _balance
     * @param {*} _gasPrice
     * @return {number}
     */
    getMaxRemainingBalance(_balance, _gasPrice) {
        const fee = this.getTransactionFee(_gasPrice, GAS_LIMITS.claimRewards);
        const balance = this.toBN(_balance);

        return parseFloat(this.WEIToFTM(balance.sub(fee.mul(this.toBN(1)))));
    }

    /**
     * @param {String} _key
     * @return {String}
     */
    isPrivateKey(_key) {
        let pk = _key;

        if (pk.substring(0, 2) !== '0x') {
            pk = `0x${pk}`;
        }

        if (pk.length !== 66 || !Web3.utils.isHexStrict(pk)) {
            pk = '';
        }

        return pk;
    }

    /**
     * @param _address
     * @return {boolean}
     */
    isValidAddress(_address) {
        return Web3.utils.isHexStrict(_address) && Web3.utils.isAddress(_address);
    }
}
