<template>
    <div class="ff">
        <FForm @f-form-submit="onPrivateKeyFormSubmit">
            <fieldset class="">
                <legend>Private key</legend>

                <div class="main">
                    <label for="pk">Please type in your private key</label>
                    <input
                        id="pk"
                        v-model="dPk"
                        type="text"
                        class="large"
                        name="pk"
                        @input="onPkInput"
                    />
                </div>

                <div class="footer">
                    <button type="submit" class="large" :disabled="dDisabled">
                        Unlock account
                    </button>
                </div>
            </fieldset>
        </FForm>
    </div>
</template>

<script>
import FForm from '../core/FForm/FForm.vue';

export default {
    components: {
        FForm,
    },

    data() {
        return {
            dPk: '',
            dDisabled: true,
        };
    },

    computed: {
        cPk() {
            return this.$fWallet.isPrivateKey(this.dPk.trim());
        },
    },

    methods: {
        onPrivateKeyFormSubmit(_event) {
            _event.detail.data.pk = this.cPk;
            this.$emit('f-form-submit', _event);
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
