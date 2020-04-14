<template>
    <div class="mnemonic-form">
        <f-form @f-form-submit="onFormSubmit">
            <fieldset>
                <legend class="not-visible">Mnemonic phrase</legend>

                <div class="main">
                    <label for="mnemonic">
                        Please type in your 12 or 24 word mnemonic phrase, all lower-case, separate by single spaces
                    </label>
                    <textarea
                        id="mnemonic"
                        v-model="dMnemonic"
                        class="inp large"
                        name="mnemonic"
                        cols="30"
                        rows="10"
                    ></textarea>

                    <f-message v-if="dErrorMsg" type="error" with-icon>{{ dErrorMsg }}</f-message>
                </div>

                <div class="footer">
                    <button type="submit" class="btn large" :disabled="dDisabled">
                        Unlock wallet
                    </button>
                </div>
            </fieldset>
        </f-form>
    </div>
</template>

<script>
import FForm from '../core/FForm/FForm.vue';
import { mapGetters } from 'vuex';
import FMessage from '../core/FMessage/FMessage.vue';

export default {
    components: {
        FMessage,
        FForm,
    },

    data() {
        return {
            dMnemonic: '',
            dDisabled: true,
            dErrorMsg: '',
        };
    },

    computed: {
        ...mapGetters(['getAccountByAddress']),
    },

    watch: {
        dMnemonic(_value) {
            const mnemonic = this.$fWallet.correctMnemonic(_value);

            this.dDisabled = !mnemonic;
        },
    },

    methods: {
        async onFormSubmit(_event) {
            const mnemonic = this.$fWallet.correctMnemonic(this.dMnemonic);

            if (mnemonic) {
                this.dErrorMsg = '';

                const keys = await this.$fWallet.mnemonicToKeys(mnemonic);
                const account = this.$fWallet.restoreAccountByPrivateKey(keys.privateKey);

                if (this.getAccountByAddress(account.address)) {
                    this.dErrorMsg = 'An account with this address already exist';
                    this.dMnemonic = '';
                } else {
                    _event.detail.data.pk = keys.privateKey;
                    this.$emit('f-form-submit', _event);
                }
            }
        },
    },
};
</script>

<style lang="scss"></style>
