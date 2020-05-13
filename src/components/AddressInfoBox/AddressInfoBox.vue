<template>
    <div class="address-info-box">
        <div class="row align-items-center collapse-md">
            <div class="col-9 align-center-md">
                <button class="no-style pick-account-btn" title="Pick an Account" @click="onPickAccountBtn">
                    <account-name :account="currentAccount" class="address">
                        <template #suffix>
                            <icon data="@/assets/svg/chevron-down.svg" width="20" height="20" />
                        </template>
                    </account-name>
                    <!--
                    <f-ellipsis :text="currentAccountAddress" overflow="middle" class="address">
                        <template #suffix>
                            <icon data="@/assets/svg/chevron-down.svg" width="20" height="20" />
                        </template>
                    </f-ellipsis>
-->
                </button>
            </div>
            <div class="col-3 align-right align-center-md">
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
import AccountPickerWindow from '../windows/AccountPickerWindow/AccountPickerWindow.vue';
// import FEllipsis from '../core/FEllipsis/FEllipsis.vue';
import AccountName from '../AccountName/AccountName.vue';

export default {
    components: { AccountName, AccountPickerWindow, AddressActionsBox },

    computed: {
        ...mapGetters(['currentAccountAddress', 'currentAccount']),
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
