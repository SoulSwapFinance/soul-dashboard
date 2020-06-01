<template>
    <div class="receive-eth">
        <receive-coin coin="ETH" @change-component="onChangeComponent" />
    </div>
</template>

<script>
import ReceiveCoin from './ReceiveCoin.vue';

export default {
    name: 'ReceiveETH',

    components: { ReceiveCoin },

    methods: {
        /**
         * Re-target `'change-component'` event.
         *
         * @param {object} _data
         */
        onChangeComponent(_data) {
            this.$emit('change-component', _data);
        },
    },
};
</script>
