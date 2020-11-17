<template>
    <div class="collateral-positions-list-dt">
        <f-data-table
            :columns="columns"
            :items="items"
            :action-on-row="actionOnRow"
            first-m-v-column-width="6"
            f-card-off
            class="f-data-table-body-bg-color"
        >
            <template v-slot:column-asset="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        <f-crypto-symbol :token="item" />
                    </div>
                </div>
                <template v-else>
                    <f-crypto-symbol :token="item" />
                </template>
            </template>

            <template v-slot:column-amount="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">{{ formatCollateral(item) }}</div>
                </div>
                <template v-else>{{ formatCollateral(item) }}</template>
            </template>

            <template v-slot:column-amount_fusd="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">{{ formatCollateralFUSD(item) }}</div>
                </div>
                <template v-else>{{ formatCollateralFUSD(item) }}</template>
            </template>

            <template v-slot:column-actions="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        <router-link :to="{ name: 'defi-lock', params: { tokenAddress: item.address } }">
                            Lock
                        </router-link>
                        ,
                        <router-link :to="{ name: 'defi-unlock', params: { tokenAddress: item.address } }">
                            Unlock
                        </router-link>
                        <template v-if="item.symbol === 'WFTM'">
                            ,
                            <router-link :to="{ name: 'defi-ftrade' }">Swap</router-link>
                        </template>
                    </div>
                </div>
                <template v-else>
                    <router-link :to="{ name: 'defi-lock', params: { tokenAddress: item.address } }">
                        Lock
                    </router-link>
                    <br />
                    <router-link :to="{ name: 'defi-unlock', params: { tokenAddress: item.address } }">
                        Unlock
                    </router-link>
                    <template v-if="item.symbol === 'WFTM'">
                        <br />
                        <router-link :to="{ name: 'defi-ftrade' }">Swap</router-link>
                    </template>
                </template>
            </template>
        </f-data-table>

        <deposit-or-borrow-token-window
            ref="win"
            :token="dbToken"
            :deposit-route-name="depositRouteName"
            :borrow-route-name="borrowRouteName"
        />
    </div>
</template>

<script>
import FDataTable from '@/components/core/FDataTable/FDataTable.vue';
import FCryptoSymbol from '@/components/core/FCryptoSymbol/FCryptoSymbol.vue';
import { numberSort, stringSort } from '@/utils/array-sorting.js';
import DepositOrBorrowTokenWindow from '@/components/windows/DepositOrBorrowTokenWindow/DepositOrBorrowTokenWindow.vue';
import { formatNumberByLocale } from '@/filters.js';
import { mapGetters } from 'vuex';
import appConfig from '../../../../app.config.js';

export default {
    name: 'CollateralPositionsList',

    components: { DepositOrBorrowTokenWindow, FCryptoSymbol, FDataTable },

    props: {
        /** @type {DefiToken[]} */
        tokens: {
            type: Array,
            required: true,
            default() {
                return [];
            },
        },
        /** @type {FMintAccount} */
        fMintAccount: {
            type: Object,
            default() {
                return {
                    collateral: [],
                    debt: [],
                };
            },
        },
        depositRouteName: {
            type: String,
            default: 'defi-manage-deposit',
        },
        borrowRouteName: {
            type: String,
            default: 'defi-manage-borrow',
        },
        /** If `true`, row will become clickable. */
        actionOnRow: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            items: [],
            /** @type {DeFi} */
            defi: this.$defi,
            /** Token used in <deposit-or-borrow-token-window> */
            dbToken: {},
            /** @type {DefiToken} */
            wftmToken: {},
            columns: [
                {
                    name: 'asset',
                    label: 'Asset',
                    sortFunc: (_itemProp, _direction = 'asc') => {
                        return (_a, _b) => {
                            const a = _a.symbol;
                            const b = _b.symbol;

                            return (_direction === 'desc' ? -1 : 1) * stringSort(a, b);
                        };
                    },
                    width: '140px',
                },
                {
                    name: 'amount',
                    label: 'Amount',
                    css: { textAlign: 'center' },
                },
                {
                    name: 'amount_fusd',
                    label: 'Amount (fUSD)',
                    sortDir: 'desc',
                    sortFunc: (_itemProp, _direction = 'asc') => {
                        return (_a, _b) => {
                            const aTokenPrice = this.defi.getTokenPrice(_a);
                            const a = this.getDebt(_a) * aTokenPrice + this.getCollateral(_a) * aTokenPrice;
                            const bTokenPrice = this.defi.getTokenPrice(_b);
                            const b = this.getDebt(_b) * bTokenPrice + this.getCollateral(_b) * bTokenPrice;

                            return (_direction === 'desc' ? -1 : 1) * numberSort(a, b);
                        };
                    },
                    css: { textAlign: 'center' },
                },
                {
                    name: 'actions',
                    label: 'Actions',
                    width: '180px',
                    css: { textAlign: 'right' },
                },
            ],
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    watch: {
        /**
         * @param {DefiToken[]} _value
         */
        async tokens(_value) {
            let tokens = _value.filter((_item) => _item.isActive && _item.canDeposit && this.usedAsCollateral(_item));

            this.wftmToken = _value.find((_item) => _item.symbol === 'WFTM');

            this.items = tokens.filter((_item) => {
                const collateral = this.getCollateral(_item);

                if (collateral !== 0) {
                    _item._collateral = collateral;

                    return true;
                }

                return false;
            });

            this.$emit('records-count', this.items.length);
        },
    },

    methods: {
        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        getDebt(_token) {
            /** @type {FMintTokenBalance} */
            const tokenBalance = this.$defi.getFMintAccountDebt(this.fMintAccount, _token);

            return this.$defi.fromTokenValue(tokenBalance.balance, _token) || 0;
        },

        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        getCollateral(_token) {
            /** @type {FMintTokenBalance} */
            const tokenBalance = this.$defi.getFMintAccountCollateral(this.fMintAccount, _token);

            return this.$defi.fromTokenValue(tokenBalance.balance, _token) || 0;
        },

        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        formatCollateral(_token) {
            const collateral = '_collateral' in _token ? _token._collateral : this.getCollateral(_token);

            return collateral > 0 ? formatNumberByLocale(collateral, this.defi.getTokenDecimals(_token)) : 0;
        },

        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        formatCollateralFUSD(_token) {
            const collateral = this.getCollateral(_token);

            return collateral > 0
                ? formatNumberByLocale(
                      collateral * this.defi.getTokenPrice(_token),
                      this.defi.getTokenDecimals({ symbol: 'FUSD' })
                  )
                : 0;
        },

        /**
         * @param {DefiToken} _token
         * @return {boolean}
         */
        usedAsCollateral(_token) {
            return _token.symbol === 'WFTM' || (_token.symbol === 'SFTM' && !appConfig.disableSFTM);
        },
    },
};
</script>
