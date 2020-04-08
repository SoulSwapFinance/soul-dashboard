<template>
    <div class="restore-account-view">
        <component
            :is="dCurrentComponent"
            v-bind="cCurrentComponentProperties"
            @change-component="onChangeComponent"
        ></component>
    </div>
</template>

<script>
import RestoreAccountTabs from '../../components/RestoreAccountTabs/RestoreAccountTabs.vue';
import CreatePassword from '../../components/CreatePassword/CreatePassword.vue';
import AccountSuccessMessage from '../../components/AccountSuccessMessage/AccountSuccessMessage.vue';

export default {
    components: { AccountSuccessMessage, RestoreAccountTabs, CreatePassword },

    data() {
        return {
            dCurrentComponent: 'restore-account-tabs',
        };
    },

    computed: {
        cCurrentComponentProperties() {
            switch (this.dCurrentComponent) {
                case 'create-password':
                    return {
                        privateKey: this._pk,
                        restoreAccount: true,
                    };
                case 'account-success-message':
                    return {
                        address: this._address,
                        restoreAccount: true,
                    };
                default:
                    return null;
            }
        },
    },

    created() {
        // temporary private key
        this._pk = '';
        // temporary address
        this._address = '';
    },

    methods: {
        /**
         * Delete temporaty properties.
         */
        deleteTmpProps() {
            this.$nextTick(() => {
                this._pk = '';
                this._address = '';
            });
        },

        /**
         * @param {Object} _event
         */
        onChangeComponent(_event) {
            const data = _event.detail;

            if (data.to === 'create-password') {
                this._pk = data.data.pk;
                this.dCurrentComponent = 'create-password';
                this.deleteTmpProps();
            } else if (data.to === 'account-success-message') {
                this._address = data.data.address;
                this.dCurrentComponent = 'account-success-message';
                this.deleteTmpProps();
            }
        },
    },
};
</script>

<style lang="scss"></style>
