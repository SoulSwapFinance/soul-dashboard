<template>
    <div class="address-info-box" :class="{ 'one-account': accountsLen === 1 }">
        <div class="row align-items-center collapse-md">
            <div class="col-8 align-center-md address-col">
                <button class="no-style pick-account-btn" title="Select Wallet" @click="onPickAccountBtn">
                    <account-name :account="currentAccount" class="address" hide-address />
                    <!--
                    <account-name :account="currentAccount" class="address" hide-address>
                        <template v-if="accountsLen > 1" #suffix>
                            <icon data="@/assets/svg/chevron-down.svg" width="20" height="20" />
                        </template>
                    </account-name>
                    -->
                    <!--
                    <f-ellipsis :text="currentAccountAddress" overflow="middle" class="address">
                        <template #suffix>
                            <icon data="@/assets/svg/chevron-down.svg" width="20" height="20" />
                        </template>
                    </f-ellipsis>
                    -->
                </button>
                <button
                    v-if="mobileView"
                    id="address-more-actions-btn"
                    class="btn light same-size round"
                    title="More Actions"
                    @click="$refs.addressActionsPopover.show()"
                >
                    <icon data="@/assets/svg/ellipsis-v.svg" width="24" height="24" aria-hidden="true" />
                </button>
            </div>
            <div v-if="!mobileView" class="col-4 align-right align-center-md">
                <address-actions-box />
            </div>
        </div>

        <account-picker-window ref="accountPickerWindow" />

        <f-window
            v-if="mobileView"
            ref="addressActionsPopover"
            popover
            no-title
            hide-on-window-mousedown
            attach-to="#address-more-actions-btn"
            attach-position="auto"
            preferred-attach-position="bottom"
            :attach-margin="[4, 4, 4, 4]"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            class="light popover-menu"
            style="width: auto; max-width: 100%;"
        >
            <address-actions-box vertical-mode @window-hide="onWindowHide" />
        </f-window>
    </div>
</template>

<script>
import AddressActionsBox from '../AddressActionsBox/AddressActionsBox.vue';
import { mapGetters } from 'vuex';
import { formatHash } from '../../filters.js';
import AccountPickerWindow from '../windows/AccountPickerWindow/AccountPickerWindow.vue';
// import FEllipsis from '../core/FEllipsis/FEllipsis.vue';
import AccountName from '../AccountName/AccountName.vue';
import FWindow from '../core/FWindow/FWindow.vue';

export default {
    components: { FWindow, AccountName, AccountPickerWindow, AddressActionsBox },

    computed: {
        ...mapGetters(['currentAccountAddress', 'currentAccount', 'accounts']),

        /**
         * Property is set to `true`, if 'menu-mobile' breakpoint is reached.
         *
         * @return {Boolean}
         */
        mobileView() {
            const menuMobileBreakpoint = this.$store.state.breakpoints['menu-mobile'];

            return menuMobileBreakpoint && menuMobileBreakpoint.matches;
        },

        /**
         * @return {number}
         */
        accountsLen() {
            return this.accounts.length;
        },
    },

    methods: {
        onPickAccountBtn() {
            if (this.accountsLen > 1) {
                this.$refs.accountPickerWindow.show();
            }
        },

        onWindowHide() {
            this.$refs.addressActionsPopover.hide();
        },

        formatHash,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
