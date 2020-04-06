<template>
    <div class="f-playground">
        <div class="narrow-container">
            <div class="row">
                <div class="col"><h1>Playground</h1></div>
            </div>

            <div class="row">
                <div class="col"><h2>Web3</h2></div>
            </div>
            <div class="row">
                <div class="col">
                    <button @click="onTest">Test</button>
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
export default {
    components: {
        FCard,
    },

    methods: {
        clickMe: function () {
            alert('jo');
        },

        onVuexPersist() {
            this.$store.commit(SET_TOKEN_PRICE, 0);
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
