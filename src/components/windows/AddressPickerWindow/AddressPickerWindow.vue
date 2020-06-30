<template>
    <div class="account-picker-window">
        <f-window
            ref="win"
            modal
            style="max-width: 1050px;"
            title="Select Address"
            class="account-picker-f-window"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            @window-hide="$emit('window-hide', $event)"
        >
            <address-picker :blockchain="blockchain" @address-picked="onAddressPicked" />
        </f-window>
    </div>
</template>

<script>
import AddressPicker from '../../AddressPicker/AddressPicker.vue';
import FWindow from '../../core/FWindow/FWindow.vue';

export default {
    name: 'AddressPickerWindow',

    components: { FWindow, AddressPicker },

    props: {
        /** @type {WalletBlockchain} */
        blockchain: {
            type: String,
            default: 'fantom',
            validator: function (_value) {
                return ['fantom', 'ethereum', 'binance'].indexOf(_value) !== -1;
            },
        },
    },

    methods: {
        show() {
            this.$refs.win.show();
        },

        onAddressPicked(_address) {
            this.$refs.win.hide('fade-leave-active');
            this.$emit('address-picked', _address);
        },
    },
};
</script>

<style scoped></style>
