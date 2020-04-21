<template>
    <div class="mnemonic-phrase mnemonic-phrase-verification">
        <h2>Verification</h2>

        <p>
            Please select the words in the correct order to verify your mnemonic phrase.
        </p>

        <ul v-if="dMnemonicToVerify" class="phrase-list no-markers" @click="onMnemonicToVerifyClick">
            <li v-for="(item, index) in dMnemonicToVerify" :key="`mn${index}`" :data-idx="index">
                <span class="num">{{ index + 1 }}</span> {{ item }}
                <button v-if="item" class="btn light same-size round small" :aria-label="`remove word ${item}`">
                    <icon data="@/assets/svg/times.svg"></icon>
                </button>
            </li>
        </ul>

        <f-message v-if="dErrorMsg" type="error" with-icon>{{ dErrorMsg }}</f-message>

        <ul
            v-if="dShuffledMnemonic.length"
            class="phrase-list phrase-list-buttons no-markers"
            @click="onShuffledMnemonicClick"
        >
            <li v-for="(item, index) in dShuffledMnemonic" :key="`mns${index}`">
                <button class="btn light" :disabled="item.disabled" :data-word="item.word">{{ item.word }}</button>
            </li>
        </ul>

        <div class="footer">
            <!--            <button class="secondary large" @click="onSubmitButClick">Back</button> &nbsp;-->
            <button class="btn large" :disabled="dVerifyButDisabled" @click="onVerifyButClick">Verify</button>
        </div>
    </div>
</template>

<script>
// import { shuffle } from '../../utils/array.js';
import { ADD_ACCOUNT } from '../../store/actions.type.js';
import FMessage from '../core/FMessage/FMessage.vue';

export default {
    components: { FMessage },

    props: {
        // {privateKey: string, mnemonic: string, keystore: EncryptedKeystoreV3Json}
        account: {
            type: Object,
            default() {
                return {
                    privateKey: '',
                    mnemonic: '',
                    keystore: null,
                };
            },
        },
    },

    data() {
        return {
            // array of mnemonic words picked by user
            dMnemonicToVerify: Array(this.$fWallet.getMnemonicArray(this.account.mnemonic).length).fill(''),
            // mnemonic phrase converted to an array
            dMnemonicArray: this.$fWallet.getMnemonicArray(this.account.mnemonic),
            // mnemonic phrase converted to an shuffled array
            dShuffledMnemonic: this.getMnemonicArrayShuffled(this.account.mnemonic),
            // is verify button disabled?
            dVerifyButDisabled: true,
            // error message
            dErrorMsg: '',
        };
    },

    created() {
        this._pickedWordsCount = 0;
    },

    methods: {
        verify() {
            const ok =
                JSON.stringify(this.dMnemonicToVerify.slice(0, this._pickedWordsCount)) ===
                JSON.stringify(this.dMnemonicArray.slice(0, this._pickedWordsCount));

            this.dErrorMsg = !ok ? 'Incorrect mnemonic phrase order.' : '';

            return ok;
        },

        /**
         * @param {String} _word
         */
        pickWord(_word) {
            const mnemonic = this.findShuffledMnemonicByWord(_word, false);

            if (mnemonic) {
                this.dMnemonicToVerify[this._pickedWordsCount] = mnemonic.word;
                this._pickedWordsCount++;
                this.$set(mnemonic, 'disabled', true);

                // if all words are picked, enable verify button
                if (this._pickedWordsCount === this.dMnemonicToVerify.length) {
                    this.dVerifyButDisabled = false;
                }

                this.verify();
            }
        },

        /**
         * @param {int} _idx
         */
        deleteWord(_idx) {
            const word = this.dMnemonicToVerify[_idx];
            const mnemonic = this.findShuffledMnemonicByWord(word, true);

            if (mnemonic) {
                this.dMnemonicToVerify.splice(_idx, 1);
                this.dMnemonicToVerify.push('');

                this._pickedWordsCount--;

                this.$set(mnemonic, 'disabled', false);

                this.dVerifyButDisabled = true;

                this.verify();
            }
        },

        /**
         * @param {String} _word
         * @param {Boolean} _disabled
         * @return {Array}
         */
        findShuffledMnemonicByWord(_word, _disabled) {
            return this.dShuffledMnemonic.find((_item) => _item.word === _word && _item.disabled === _disabled);
        },

        /**
         * @param {String }_mnemonic Mnemonic phrase.
         * @return {{disabled: Boolean, word: String}[]}
         */
        getMnemonicArrayShuffled(_mnemonic) {
            const mnemonicArray = this.$fWallet.getMnemonicArray(_mnemonic);

            // shuffle(mnemonicArray);
            mnemonicArray.sort();

            return mnemonicArray.map((_item) => {
                return {
                    word: _item,
                    disabled: false,
                };
            });
        },

        /**
         * @param {Event} _event
         */
        onShuffledMnemonicClick(_event) {
            const button = _event.target.closest('button');
            let word = '';

            if (button) {
                word = button.getAttribute('data-word');
                if (word) {
                    this.pickWord(word);
                }
            }
        },

        /**
         * @param {Event} _event
         */
        onMnemonicToVerifyClick(_event) {
            const button = _event.target.closest('button');
            const elem = button ? button.closest('[data-idx]') : null;
            let idx = -1;

            if (elem && !button.disabled) {
                idx = parseInt(elem.getAttribute('data-idx'));
                if (idx > -1) {
                    this.deleteWord(idx);
                }
            }
        },

        // onSubmitButClick() {},

        onVerifyButClick() {
            if (this._pickedWordsCount === 24 && this.verify()) {
                // save account
                this.$store.dispatch(ADD_ACCOUNT, this.account.keystore);
                // go to success view
                this.$emit('change-component', {
                    detail: {
                        from: 'mnemonic-phrase-verification',
                        data: {
                            address: this.$fWallet.toChecksumAddress(this.account.keystore.address),
                        },
                    },
                });
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
