<template>
    <div class="restore-account-view">
        <f-card class="window">
            <div class="header">
                <h1>Restore wallet</h1>
            </div>
            <div class="body">
                <h2>Private key</h2>

                <private-key-form @f-form-submit="onPrivateKeyFormSubmit" />
            </div>
        </f-card>
        <component :is="currentTabComponent"></component>
    </div>
</template>

<script>
import FCard from '../../components/core/FCard/FCard.vue';
import PrivateKeyForm from '../../components/forms/PrivateKeyForm.vue';
import { findFirstFocusableDescendant } from '../../utils/aria.js';
import { SET_PRIVATE_KEY } from '../../store/mutations.type.js';

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
                console.log('JO!!', pk);
                this.$store.commit(SET_PRIVATE_KEY, pk);
                this.$router.replace({ name: 'create-account' });
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
