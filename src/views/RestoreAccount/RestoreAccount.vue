<template>
    <div class="restore-account-view">
        <f-card class="window">
            <div class="header">
                <h1>
                    Restore wallet
                    <span class="steps">
                        {{ dStep }} <span class="count">/ {{ dStepsCount }}</span>
                    </span>
                    <router-link to="/" class="router-link">
                        <icon data="@/assets/svg/times.svg" width="24" height="24"></icon>
                    </router-link>
                </h1>
            </div>
            <div class="body">
                <component
                    :is="dCurrentComponent"
                    v-bind="cCurrentComponentProperties"
                    @change-component="onChangeComponent"
                    @steps-count="onStepsCount"
                ></component>
            </div>
        </f-card>
    </div>
</template>

<script>
import RestoreAccountTabs from '../../components/RestoreAccountTabs/RestoreAccountTabs.vue';
import AccountSuccessMessage from '../../components/AccountSuccessMessage/AccountSuccessMessage.vue';
import CreatePasswordForm from '../../components/forms/CreatePasswordForm.vue';
import FCard from '../../components/core/FCard/FCard.vue';

const DEFAULT_COMPONENT = 'restore-account-tabs';

export default {
    components: { FCard, CreatePasswordForm, AccountSuccessMessage, RestoreAccountTabs },

    data() {
        return {
            dCurrentComponent: DEFAULT_COMPONENT,
            dStep: 1,
            dStepsCount: 2,
        };
    },

    computed: {
        cCurrentComponentProperties() {
            switch (this.dCurrentComponent) {
                case 'create-password-form':
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

        setDefaultComponent() {
            this.dCurrentComponent = DEFAULT_COMPONENT;
            this.dStep = 1;
        },

        /**
         * @param {Object} _event
         */
        onChangeComponent(_event) {
            const data = _event.detail;

            if (data.to === 'create-password-form') {
                this._pk = data.data.pk;
                this.dCurrentComponent = 'create-password-form';
                this.deleteTmpProps();
                this.dStep++;
            } else if (data.to === 'account-success-message') {
                this._address = data.data.address;
                this.dCurrentComponent = 'account-success-message';
                this.deleteTmpProps();
                this.dStep++;
            }
        },

        onStepsCount(_value) {
            this.dStepsCount = _value;
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
