<template>
    <div class="private-key-form">
        <f-form @f-form-submit="onFormSubmit">
            <fieldset>
                <legend class="not-visible">Private key</legend>

                <div class="main">
                    <f-input
                        v-model="dPk"
                        type="text"
                        label="Please type in your private key"
                        field-size="large"
                        name="pk"
                        @input="onPkInput"
                    />
                </div>

                <div class="footer">
                    <div v-if="dErrorMsg" class="tmp-error">{{ dErrorMsg }}</div>

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
import FInput from '../core/FInput/FInput.vue';

export default {
    components: {
        FInput,
        FForm,
    },

    data() {
        return {
            dPk: '',
            dDisabled: true,
            dErrorMsg: '',
        };
    },

    computed: {
        cPk() {
            return this.$fWallet.isPrivateKey(this.dPk.trim());
        },
        ...mapGetters(['getAccountByAddress']),
    },

    methods: {
        onFormSubmit(_event) {
            const pk = this.cPk;
            const account = this.$fWallet.restoreAccountByPrivateKey(pk);

            this.dErrorMsg = '';

            if (this.getAccountByAddress(account.address)) {
                this.dErrorMsg = 'An account with this address already exist';
                this.dPk = '';
            } else {
                _event.detail.data.pk = pk;
                this.$emit('f-form-submit', _event);
            }
        },

        onPkInput() {
            const pk = this.cPk;

            this.dDisabled = !pk;

            if (!this.dDisabled) {
                this.dPk = pk;
            }
        },
    },
};
</script>

<style lang="scss"></style>
