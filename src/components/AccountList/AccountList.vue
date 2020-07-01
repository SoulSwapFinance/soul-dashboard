<template>
    <div
        class="account-list"
        :class="{ 'edit-mode': editMode }"
        @click="onAccountListClick"
        @keyup="onAccountListKeyup"
    >
        <ul class="no-markers">
            <li v-for="(account, index) in accounts" :key="account.address">
                <f-card>
                    <h3 slot="title" class="title">
                        <span class="row no-collapse align-items-start">
                            <span class="col col-6-md">
                                <span class="value">
                                    {{ toFTM(account.totalBalance) }} <span class="ftm">FTM</span>
                                </span>
                                <span class="currency">
                                    {{ formatCurrencyByLocale(account.totalBalance, tokenPrice) }}
                                </span>
                                <span class="label">Total</span>
                            </span>
                            <span class="col col-6-md">
                                <span class="value">{{ toFTM(account.balance) }} <span class="ftm">FTM</span></span>
                                <span class="currency">
                                    {{ formatCurrencyByLocale(account.balance, tokenPrice) }}
                                </span>
                                <span class="label">Available</span>
                            </span>
                            <span
                                class="col-5 col-10-md align-right align-left-md"
                                :class="{ 'account-name-exists': !!account.name }"
                            >
                                <span class="address-col">
                                    <span
                                        v-if="pickMode"
                                        class="value clickable"
                                        :data-address="account.address"
                                        tabindex="0"
                                    >
                                        <account-name align-right :account="account" />
                                    </span>
                                    <router-link
                                        v-else
                                        :to="{
                                            name: routeName,
                                            params: { address: account.address },
                                        }"
                                        class="value clickable"
                                        aria-label="Address"
                                        :data-address="account.address"
                                    >
                                        <account-name align-right :account="account" />
                                    </router-link>

                                    <f-copy-button
                                        :text="account.address"
                                        tooltip="Copy address to clipboard"
                                        :default-icon-size="16"
                                        class="btn light same-size round"
                                    >
                                        <template #popover-text>
                                            Address copied to clipboard. <br />
                                            Warning: Use this address to receive Opera FTM only. If you are receiving
                                            FTM-ERC20 you need to use a different address!
                                        </template>
                                    </f-copy-button>

                                    <button
                                        v-if="editMode"
                                        class="btn large_ light same-size round btn-edit"
                                        title="Edit Wallet"
                                        :data-address="account.address"
                                        :data-index="index"
                                    >
                                        <icon data="@/assets/svg/pen.svg" width="16" height="16" aria-hidden="true" />
                                    </button>
                                </span>
                                <span class="label">
                                    <template v-if="account.isLedgerAccount">
                                        Ledger
                                    </template>
                                    <template v-else>
                                        Keystore file
                                    </template>
                                </span>
                            </span>

                            <!--
                            <span v-if="editMode" class="col-1 col-2-md align-right">
                                <ul class="account-edit-actions">
                                    <li>
                                        <button
                                            class="btn large_ light same-size round"
                                            title="Edit Wallet"
                                            :data-address="account.address"
                                            :data-index="index"
                                            @click="onEditAccountClick"
                                        >
                                            <icon
                                                data="@/assets/svg/pen.svg"
                                                width="16"
                                                height="16"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </li>
                                </ul>
                            </span>
-->
                        </span>
                    </h3>
                </f-card>
            </li>
        </ul>

        <account-settings-window v-if="editMode" ref="accountSettingsWindow" :account-data="accountData" />
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import { mapGetters } from 'vuex';
import { toFTM } from '../../utils/transactions.js';
import {
    DEACTIVATE_ACTIVE_ACCOUNT,
    SET_ACTIVE_ACCOUNT_ADDRESS,
    SET_ACTIVE_ACCOUNT_BY_ADDRESS,
} from '../../store/mutations.type.js';
import { eventBusMixin } from '../../mixins/event-bus.js';
import { UPDATE_ACCOUNTS_BALANCES } from '../../store/actions.type.js';
import AccountSettingsWindow from '../windows/AccountSettingsWindow/AccountSettingsWindow.vue';
import AccountName from '../AccountName/AccountName.vue';
import { pollingMixin } from '../../mixins/polling.js';
import FCopyButton from '../core/FCopyButton/FCopyButton.vue';
import { formatCurrencyByLocale } from '../../filters.js';
import { isAriaAction } from '../../utils/aria.js';

export default {
    name: 'AccountList',

    components: { FCopyButton, AccountName, AccountSettingsWindow, FCard },

    mixins: [eventBusMixin, pollingMixin],

    props: {
        /** Show action icons on the right side. */
        editMode: {
            type: Boolean,
            default: false,
        },
        /** Emit 'account-picked' event when whole account element is clicked. */
        pickMode: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            routeName: 'account-history',
            accountData: {
                address: '',
                index: -1,
            },
        };
    },

    computed: {
        ...mapGetters(['accounts', 'currentAccount']),

        tokenPrice() {
            return this.$store.state.tokenPrice;
        },
    },

    watch: {
        $route(_route) {
            if (_route.params && _route.params.address) {
                this.$emit('account-picked', _route.params.address);
                this._eventBus.emit('account-picked', _route.params.address);
            }
        },
    },

    created() {
        const routeName = this.$route.name;

        if (routeName.indexOf('account-') > -1) {
            this.routeName = routeName;
        }
    },

    mounted() {
        this.$store.dispatch(UPDATE_ACCOUNTS_BALANCES);
        /*
        this.$store.dispatch(UPDATE_ACCOUNTS_BALANCES).then(() => {
            this.$emit('accounts-updated');
        });
        */

        this._polling.start(
            'account-list',
            () => {
                this.$store.dispatch(UPDATE_ACCOUNTS_BALANCES);
            },
            3000
        );
    },

    beforeDestroy() {
        const route = this.$route;

        if (route.params && route.params.address) {
            this.pickAccount(route.params.address);
        }
    },

    methods: {
        /**
         * @param {string} _address
         */
        pickAccount(_address) {
            this.$store.commit(DEACTIVATE_ACTIVE_ACCOUNT);
            this.$store.commit(SET_ACTIVE_ACCOUNT_BY_ADDRESS, _address);
            this.$store.commit(SET_ACTIVE_ACCOUNT_ADDRESS, _address);
        },

        /**
         * @param {Event} _event
         */
        onAccountListClick(_event) {
            if (!this.onEditAccountButtonClick(_event)) {
                const elem = _event.target.closest('[data-address]');
                const address = elem ? elem.getAttribute('data-address') : '';

                // if (address && address.toLowerCase() === this.currentAccount.address.toLowerCase()) {
                if (address) {
                    this.$emit('account-picked', address);
                }
            }
        },

        /**
         * @param {Event} _event
         */
        onEditAccountButtonClick(_event) {
            const elem = _event.target.closest('[data-address]');
            const address = elem ? elem.getAttribute('data-address') : '';
            const index = elem ? parseInt(elem.getAttribute('data-index')) : -1;

            if (address && !isNaN(index) && index > -1) {
                this.accountData = { address, order: index + 1 };
                this.$refs.accountSettingsWindow.show();

                return true;
            }

            return false;
        },

        /**
         * @param {KeyboardEvent} _event
         */
        onAccountListKeyup(_event) {
            if (this.pickMode && isAriaAction(_event) && !_event.target.closest('.btn')) {
                const elem = _event.target.closest('[data-address]');
                const address = elem ? elem.getAttribute('data-address') : '';

                if (address) {
                    this.$emit('account-picked', address);
                }
            }
        },

        formatCurrencyByLocale,
        toFTM,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
