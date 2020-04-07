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

export default {
    components: { RestoreAccountTabs, CreatePassword },

    data() {
        return {
            dCurrentComponent: 'restore-account-tabs',
        };
    },

    computed: {
        cCurrentComponentProperties() {
            if (this.dCurrentComponent === 'create-password') {
                return {
                    privateKey: this._pk,
                    restoreAccount: true,
                };
            }

            return null;
        },
    },

    created() {
        this._pk = '';
    },

    methods: {
        /**
         * Delete private key.
         */
        deletePK() {
            this.$nextTick(() => {
                this._pk = '';
            });
        },

        /**
         * @param {Object} _event
         */
        onChangeComponent(_event) {
            const data = _event.detail;

            if (data.component === 'private-key-form') {
                this._pk = data.data.pk;
                this.dCurrentComponent = 'create-password';
                this.deletePK();
            }
        },
    },
};
</script>

<style lang="scss"></style>
