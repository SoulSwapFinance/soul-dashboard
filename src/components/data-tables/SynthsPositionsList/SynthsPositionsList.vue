<template>
    <div class="synths-positions-list-dt">
        <f-data-table
            :columns="columns"
            :items="items"
            :action-on-row="actionOnRow"
            first-m-v-column-width="6"
            f-card-off
            class="f-data-table-body-bg-color"
        >
            <template v-slot:column-asset="{ item, column }">
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

            <template v-slot:column-amount="{ item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">{{ formatDebt(item) }}</div>
                </div>
                <template v-else>{{ formatDebt(item) }}</template>
            </template>

            <template v-slot:column-amount_fusd="{ item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">{{ formatDebtFUSD(item) }}</div>
                </div>
                <template v-else>{{ formatDebtFUSD(item) }}</template>
            </template>

            <template v-slot:column-actions="{ item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        <router-link :to="{ name: 'defi-mint', params: { tokenAddress: item.address } }">
                            Mint
                        </router-link>
                        ,
                        <router-link :to="{ name: 'defi-repay', params: { tokenAddress: item.address } }">
                            Repay
                        </router-link>
                    </div>
                </div>
                <template v-else>
                    <router-link :to="{ name: 'defi-mint', params: { tokenAddress: item.address } }">
                        Mint
                    </router-link>
                    <br />
                    <router-link :to="{ name: 'defi-repay', params: { tokenAddress: item.address } }">
                        Repay
                    </router-link>
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
import { MAX_TOKEN_DECIMALS_IN_TABLES } from '@/plugins/fantom-web3-wallet.js';

export default {
    name: 'SynthsPositionsList',

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
                    label: 'fUSD($)',
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

    watch: {
        /**
         * @param {DefiToken[]} _value
         */
        async tokens(_value) {
            let tokens = _value.filter((_item) => _item.isActive && _item.canMint && _item.symbol !== 'FTM');

            const items = tokens.filter((_item) => {
                const debt = this.getDebt(_item);

                if (debt !== 0) {
                    _item._debt = debt;

                    return true;
                }

                return false;
            });

            this.items = items;

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
        formatDebt(_token) {
            const debt = '_debt' in _token ? _token._debt : this.getDebt(_token);

            return debt > 0
                ? formatNumberByLocale(debt, this.defi.getTokenDecimals(_token, MAX_TOKEN_DECIMALS_IN_TABLES))
                : 0;
        },

        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        formatDebtFUSD(_token) {
            const debt = this.getDebt(_token);

            return debt > 0
                ? formatNumberByLocale(
                      debt * this.defi.getTokenPrice(_token),
                      this.defi.getTokenDecimals({ symbol: 'FUSD' }, MAX_TOKEN_DECIMALS_IN_TABLES)
                  )
                : 0;
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
    },
};
</script>
