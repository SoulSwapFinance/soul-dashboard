<template>
    <div class="receive-bnb">
        <receive-coin coin="BNB" @change-component="onChangeComponent" />
    </div>
</template>

<script>
import ReceiveCoin from './ReceiveCoin.vue';

export default {
    name: 'ReceiveBNB',

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
