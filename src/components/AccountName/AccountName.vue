<template>
    <span class="account-name" :class="cssClass">
        <template v-if="account.name">
            <span class="an-name">{{ account.name }}</span>
            <!--            <span class="an-address">{{ account.address | formatHash }}</span>-->
            <slot name="suffix"></slot>
            <f-ellipsis :text="account.address" overflow="middle" :align-right="alignRight" class="an-address" />
        </template>
        <f-ellipsis v-else :text="account.address" overflow="middle" :align-right="alignRight" class="an-address">
            <template #suffix><slot name="suffix"></slot></template>
        </f-ellipsis>
    </span>
</template>

<script>
import FEllipsis from '../core/FEllipsis/FEllipsis.vue';

export default {
    name: 'AccountName',

    components: { FEllipsis },

    props: {
        /** Account object. */
        account: {
            type: Object,
            default() {
                return {};
            },
            required: true,
        },
        /** Align text to the right. */
        alignRight: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        cssClass() {
            return {
                'has-name': !!this.account.name,
                'an-align-right': this.alignRight,
            };
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
