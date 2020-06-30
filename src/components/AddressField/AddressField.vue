<template>
    <span class="address-field form-field">
        <f-input ref="input" v-bind="fInputProps" :value="inputValue" @input="onInput">
            <template #top="sProps">
                <div class="input-label-layout">
                    <label :for="sProps.inputId">{{ sProps.label }}</label>
                    <button v-show="selectBtnVisible" type="button" class="btn light small" @click="onSelectClick">
                        Select Address
                    </button>
                </div>
            </template>
            <template #prefix="sProps">
                <slot name="prefix" v-bind="sProps"></slot>
            </template>
            <template #suffix="sProps">
                <slot name="suffix" v-bind="sProps">
                    <span @click="onEyeButtonClick">
                        <span
                            v-show="addIconVisible"
                            class="btn same-size round small light"
                            aria-hidden="true"
                            tabindex="0"
                            title="Add To Address Book"
                        >
                            <icon data="@/assets/svg/plus.svg" width="16" height="16" aria-hidden="true" />
                        </span>
                    </span>
                </slot>
            </template>
            <template #bottom="sProps">
                <slot name="bottom" v-bind="sProps"></slot>
            </template>
        </f-input>

        <address-picker-window ref="pickAddressWindow" :blockchain="blockchain" @address-picked="onAddressPicked" />
    </span>
</template>

<script>
import FInput from '../core/FInput/FInput.vue';
import { inputMixin } from '../../mixins/input.js';
import AddressPickerWindow from '../windows/AddressPickerWindow/AddressPickerWindow.vue';
import { mapGetters } from 'vuex';

/**
 * Input field with possibility to pick an address from address book or wallets and for adding address to address book.
 */
export default {
    name: 'AddressField',

    components: { AddressPickerWindow, FInput },

    mixins: [inputMixin],

    props: {
        ...FInput.props,
        /** @type {WalletBlockchain} */
        blockchain: {
            type: String,
            default: 'fantom',
            validator: function (_value) {
                return ['fantom', 'ethereum', 'binance'].indexOf(_value) !== -1;
            },
        },
    },

    data() {
        return {
            inputValue: '',
            addIconVisible: false,
        };
    },

    computed: {
        ...mapGetters(['getContactAndIndexByAddress', 'getAccountAndIndexByAddress', 'getContactsByBlockchain']),

        selectBtnVisible() {
            const { blockchain } = this;

            if (blockchain !== 'fantom') {
                return this.getContactsByBlockchain(blockchain).length > 0;
            }

            return true;
        },

        fInputProps() {
            return {
                ...FInput.computed.fInputProps.call(this),
            };
        },
    },

    methods: {
        setAddIconVisibility(_address) {
            this.addIconVisible =
                !!_address &&
                this.$fWallet.isValidAddress(_address, this.blockchain) &&
                !(
                    (this.blockchain === 'fantom' && this.getAccountAndIndexByAddress(_address).index !== -1) ||
                    this.getContactAndIndexByAddress(_address).index !== -1
                );
        },

        async validate() {
            await this.$refs.input.validate();
        },

        onSelectClick() {
            this.$refs.pickAddressWindow.show();
        },

        onAddressPicked(_address) {
            this.inputValue = _address;
            this.setAddIconVisibility(_address);
        },

        onEyeButtonClick() {},

        onInput(_value) {
            this.setAddIconVisibility(_value.trim());
            this.$emit('input', _value);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
