<template>
    <div class="restore-account-tabs">
        <f-card class="window">
            <div class="header">
                <h1>Restore wallet</h1>
            </div>
            <div class="body">
                <h2>Private key</h2>

                <private-key-form @f-form-submit="onPrivateKeyFormSubmit" />
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '../../components/core/FCard/FCard.vue';
import PrivateKeyForm from '../../components/forms/PrivateKeyForm.vue';
import { findFirstFocusableDescendant } from '../../utils/aria.js';

export default {
    components: { PrivateKeyForm, FCard },

    mounted() {
        const el = findFirstFocusableDescendant(this.$el);
        if (el) {
            el.focus();
        }
        // setTimeout(() => {findFirstFocusableDescendant(this.$el)}, 10);
        // this.$nextTick(() => {findFirstFocusableDescendant(this.$el)});
    },

    methods: {
        onPrivateKeyFormSubmit(_event) {
            const pk = _event.detail.data.pk;

            if (pk) {
                this.$emit('change-component', {
                    detail: {
                        from: 'restore-account-tabs',
                        to: 'private-key-form',
                        data: { pk },
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
