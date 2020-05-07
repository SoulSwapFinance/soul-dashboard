<template>
    <div class="address-info-box">
        <div class="row align-items-center collapse-md">
            <div class="col-9 align-center-md">
                <button class="no-style" title="Pick an Account" @click="onPickAccountBtn">
                    <strong class="address break-word">
                        {{ cMobileView ? formatHash(currentAccountAddress) : currentAccountAddress }}
                        <icon data="@/assets/svg/chevron-down.svg" width="20" height="20" />
                    </strong>
                </button>
            </div>
            <div class="col align-right align-center-md">
                <address-actions-box />
            </div>
        </div>

        <account-picker-window ref="accountPickerWindow" />
    </div>
</template>

<script>
import AddressActionsBox from '../AddressActionsBox/AddressActionsBox.vue';
import { mapGetters } from 'vuex';
import { formatHash } from '../../filters.js';
import AccountPickerWindow from '../windows/AccountPickerWindow.vue';

export default {
    components: { AccountPickerWindow, AddressActionsBox },

    computed: {
        ...mapGetters(['currentAccountAddress']),

        /**
         * Property is set to `true`, if 'menu-mobile' breakpoint is reached.
         *
         * @return {Boolean}
         */
        cMobileView() {
            const menuBreakpoint = this.$store.state.breakpoints['menu-mobile'];

            return menuBreakpoint && menuBreakpoint.matches;
        },
    },

    methods: {
        onPickAccountBtn() {
            this.$refs.accountPickerWindow.show();
        },

        formatHash,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
