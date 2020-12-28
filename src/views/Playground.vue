<template>
    <div class="f-playground">
        <div class="narrow-container">
            <div class="row">
                <div class="col"><h1>Playground</h1></div>
            </div>

            <div class="row">
                <div class="col">
                    <h2>Metamask</h2>
                    <div>
                        <!--                        <button class="btn" @click="getAccounts">Get accounts</button>-->
                        <h3>Accounts:</h3>
                        <div>{{ metAccounts }}</div>
                        <button class="btn" @click="requestAccounts">Request accounts</button>
                        <button class="btn" @click="metamaskTest">Test</button>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <h2>Add tmp account</h2>
                    <div>
                        <input v-model="tmpAccount" type="text" class="inp" style="width: 440px;" />
                        <button class="btn" @click="addTmpAccount">Add</button>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <h2>Transaction success message - success</h2>
                    <div>
                        <transaction-success-message
                            tx="0x8c77b13239ccabcdaf05cadf36b698273523947eab583d7df424744ff2632392"
                            continue-to="blabla"
                        />
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <h2>Transaction success message - error</h2>
                    <div>
                        <transaction-success-message
                            tx="0xfe2c9b9c10287872137c8172a1948819dcc45da815184484138c2915bf4bae8b"
                            continue-to="blabla"
                        />
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <h2>Address picker</h2>
                    <div>
                        <button class="btn" @click="pickAddress">Pick address</button>
                        <br />
                        Picked address: {{ pickedAddress }}
                    </div>

                    <address-picker-window ref="pickAddressWindow" @address-picked="pickedAddress = $event" />
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <h2>Address field</h2>
                    <div>
                        <address-field label="Send To" field-size="large" name="secondaryPwd" />
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col"><h2>Web3</h2></div>
            </div>
            <div class="row">
                <div class="col">
                    <button @click="onTest">Test</button>
                    <button @click="prevody">Prevody</button>
                    <button @click="onVuexPersist">Vuex persist</button>
                    token price {{ $store.state.tokenPrice }}
                </div>
            </div>

            <div class="row">
                <div class="col"><h2>Cards</h2></div>
            </div>
            <div class="row">
                <div class="col">
                    <h3>Default card</h3>
                    <f-card>
                        <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta eos minima numquam.
                            Accusamus asperiores eaque magni nisi, perspiciatis quam repellat! Ab beatae consectetur
                            cumque dignissimos, fuga provident quod vel? Quos?
                        </div>
                    </f-card>
                </div>
                <div class="col">
                    <h3>Card with title</h3>
                    <f-card title="Title">
                        <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta eos minima numquam.
                            Accusamus asperiores eaque magni nisi, perspiciatis quam repellat! Ab beatae consectetur
                            cumque dignissimos, fuga provident quod vel? Quos?
                        </div>
                    </f-card>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <h3>Card with title and url</h3>
                    <f-card title="Title" url="https://fantom.foundation">
                        <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta eos minima numquam.
                            Accusamus asperiores eaque magni nisi, perspiciatis quam repellat! Ab beatae consectetur
                            cumque dignissimos, fuga provident quod vel? Quos?
                        </div>
                    </f-card>
                </div>
                <div class="col">
                    <h3>Card with title and routeUrl</h3>
                    <f-card title="Title" :route-url="{ name: 'home' }">
                        <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta eos minima numquam.
                            Accusamus asperiores eaque magni nisi, perspiciatis quam repellat! Ab beatae consectetur
                            cumque dignissimos, fuga provident quod vel? Quos?
                        </div>
                    </f-card>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <h3>Card with custom title slot</h3>
                    <f-card>
                        <h4 slot="title">Custom <i>title slot</i></h4>
                        <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta eos minima numquam.
                            Accusamus asperiores eaque magni nisi, perspiciatis quam repellat! Ab beatae consectetur
                            cumque dignissimos, fuga provident quod vel? Quos?
                        </div>
                    </f-card>
                </div>
            </div>

            <div class="row">
                <div class="col"><h2>Buttons</h2></div>
            </div>
            <div class="row double-col-padding">
                <div class="col">
                    <f-card>
                        <div>
                            <button>E</button>
                        </div>

                        <div>
                            <label for="sel1">test select</label>
                            <select id="sel1" name="bla">
                                <option value="1">Option 1</option>
                                <option value="2">Option 2</option>
                                <option value="3">Option 3</option>
                            </select>
                        </div>
                    </f-card>
                </div>
                <div class="col"></div>
            </div>
        </div>
    </div>
</template>

<script>
import FCard from '../components/core/FCard/FCard.vue';
import { SET_TOKEN_PRICE } from '../store/mutations.type.js';
import AddressPickerWindow from '../components/windows/AddressPickerWindow/AddressPickerWindow.vue';
import AddressField from '../components/AddressField/AddressField.vue';
import TransactionSuccessMessage from '../components/TransactionSuccessMessage/TransactionSuccessMessage.vue';
import { Web3 } from '@/plugins/fantom-web3-wallet.js';
import { ADD_ACCOUNT } from '@/store/actions.type.js';
// import { TokenPairs } from '@/utils/token-pairs.js';

export default {
    components: {
        TransactionSuccessMessage,
        AddressField,
        AddressPickerWindow,
        FCard,
    },

    data() {
        return {
            pickedAddress: '',
            tmpAccount: '',
            metAccounts: [],
        };
    },

    mounted() {
        // this.initMetamask();
        // this.testGetPairTokens();
    },

    methods: {
        /*
        testGetPairTokens() {
            const pairs = [
                { pairAddress: 'P1', tokens: [{ address: 'A' }, { address: 'B' }] },
                { pairAddress: 'P2', tokens: [{ address: 'A' }, { address: 'C' }] },
                { pairAddress: 'P3', tokens: [{ address: 'B' }, { address: 'D' }] },
                { pairAddress: 'P4', tokens: [{ address: 'B' }, { address: 'E' }] },
                { pairAddress: 'P5', tokens: [{ address: 'C' }, { address: 'F' }] },
            ];
            const token = { address: 'B' };
            /!*
            console.log(
                TokenPairs.getAddresses(TokenPairs.getTokensFromPairs(TokenPairs.getTokenPairs(pairs, token), token))
            );
            console.log('--- getPairByTokens() ---');
            console.log(TokenPairs.getPairByTokens(pairs, [{ address: 'D' }, { address: 'B' }]));
            console.log(TokenPairs.getPairByTokens(pairs, [{ address: 'B' }, { address: 'D' }]));
            *!/
            console.log('--- paths ---');
            console.log(TokenPairs.getDirectPaths(pairs, token));
            console.log(TokenPairs.getPaths(pairs, token));
        },
*/

        async getAccounts() {
            this.metAccounts = await this.$metamask.getAccounts();
            setTimeout(() => {
                console.log('!!!', this.$metamask._web3.eth.accounts[0], this.$metamask._web3.eth.accounts.wallet);
            }, 2000);
        },

        async requestAccounts() {
            this.metAccounts = await this.$metamask.requestAccounts();
        },

        metamaskTest() {
            this.$metamask.tmpTest();
        },

        async initMetamask() {
            await this.$metamask.init();

            console.log('az ted');
            this.getAccounts();
        },

        addTmpAccount() {
            this.$store.dispatch(ADD_ACCOUNT, { address: this.tmpAccount });
        },

        pickAddress() {
            this.$refs.pickAddressWindow.show();
        },

        clickMe: function () {
            alert('jo');
        },

        onVuexPersist() {
            this.$store.commit(SET_TOKEN_PRICE, 0);
        },

        prevody() {
            // TMP
            /*
            const bla = '28102295766007700440022';
            console.log(
                this.token,
                parseInt(this.token.price, 16),
                bla,
                this.tokenPrice,
                this.collateral,
                (this.tokenPrice * this.collateral) / 3
            );
*/
            const debt = this.$fWallet.toBN('0x54b40b1f852bd977480'); // 18
            const minColl = this.$fWallet.toBN('0x7530'); // 4
            const price = this.$fWallet.toBN('0x19cd78'); // 8
            console.log(debt.toString(), minColl.toString(), price.toString());
            console.log(
                debt.mul(price).div(minColl).toString(),
                this.$defi.shiftDecPointLeft(debt.mul(price).div(minColl), 18 + 8 - 4),
                parseFloat(this.$defi.shiftDecPointLeft(debt.mul(price).div(minColl), 18 + 8 - 4))
            );
            console.log(this.tokens);

            const tmp = '100.041218521513198896';
            console.log('tmp', tmp);
            console.log(this.$defi.shiftDecPointRight(tmp, 18));
            console.log(this.$defi.shiftDecPointRight('123', 2));
            console.log(this.$defi.shiftDecPointRight('123.456', 2));
            console.log(this.$defi.shiftDecPointRight('123.456', 3));
            console.log(this.$defi.shiftDecPointRight('123.456', 5));
            console.log(this.$defi.shiftDecPointRight('0.0005', 5));
            console.log(this.$defi.shiftDecPointRight(8.965e-15, 18));

            /*
            console.log(
                df,
                df.toString(16),
                this.$defi.shiftDecPointLeft(
                    Web3.utils.hexToNumberString('0x' + this.$defi.shiftDecPointRight(df.toString(16), 18)),
                    18
                )
            );
*/
            console.log(Web3.utils.hexToNumber('0x0'));

            // prepocet:
            // chci napr. A (e12) x Price (e5) a vysledek je v e7, tak pak e12 + e5 - e7 = e10
        },

        onTest() {
            console.log('test---');
            // console.log(this.$fWallet.web3.eth.accounts);
            // const eee = this.$fWallet.web3.eth.accounts.wallet.save('test#!$');
            // console.log(eee);
            const tmpPwd = 'A0e!@fff2';
            const tmpPKey = '0x0eb5dd4c57efd9a3b813b824a0a7c1387dffe367c7f573867d4fefa801474b22';
            const tmpKeystore = {
                version: 3,
                id: 'dc75e739-83e3-48ce-bbdf-7278cd070bfc',
                address: '76ae07e6d236c1ae3f5c3112f387ad82c69a2471',
                crypto: {
                    ciphertext: 'ae9ccb22b7eb3fcf4de63a9f573cbfdab9aef2a91b5c4dcb71439fd319fa194e',
                    cipherparams: { iv: '5d8bb32a8bae3c5e2b59320ab280fe27' },
                    cipher: 'aes-128-ctr',
                    kdf: 'scrypt',
                    kdfparams: {
                        dklen: 32,
                        salt: '7b7b8f84587652e67a2f14d129f7f4eb7414be2e39369bf5cc397e09a6127596',
                        n: 8192,
                        r: 8,
                        p: 1,
                    },
                    mac: '6206ee875951ace5c8b12334e655990cf9d2628c0c37cd3114ee30836e517767',
                },
            };
            let t1 = 0;
            let t2 = 0;

            try {
                t1 = performance.now();
                const account = this.$fWallet.restoreAccountByPrivateKey(tmpPKey);
                t2 = performance.now() - t1;
                console.log('account', account, t2);
            } catch (_error) {
                console.log('restoreAccountByPrivateKey failed', _error);
            }

            try {
                t1 = performance.now();
                const keystore = this.$fWallet.encryptToKeystore(tmpPKey, tmpPwd);
                t2 = performance.now() - t1;
                console.log('keyStore', keystore, t2);
            } catch (_error) {
                console.log('encryptToKeystore failed', _error);
            }

            try {
                t1 = performance.now();
                const accountFromKeystore = this.$fWallet.decryptFromKeystore(tmpKeystore, tmpPwd);
                t2 = performance.now() - t1;
                console.log('accountFromKeystore', accountFromKeystore, t2);
            } catch (_error) {
                console.log('accountFromKeystore failed', _error);
            }
        },
    },
};
</script>

<style lang="scss"></style>
