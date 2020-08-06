<template>
    <div class="open-positions-list-dt">
        <f-data-table
            :columns="columns"
            :items="items"
            first-m-v-column-width="6"
            f-card-off
            class="f-data-table-body-bg-color"
            @row-action="onRowAction"
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

            <template v-slot:column-balance="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        deposit: <b>{{ formatCollateral(item) }} </b>
                        <span class="currency-light">{{ $defi.getTokenSymbol(item) }}</span> <br />
                        borrowed: <b>{{ formatDebt(item) }} </b>
                        <span class="currency-light">{{ $defi.getTokenSymbol(item) }}</span>
                    </div>
                </div>
                <template v-else>
                    deposit: <b>{{ formatCollateral(item) }} </b>
                    <span class="currency-light">{{ $defi.getTokenSymbol(item) }}</span> <br />
                    borrowed: <b>{{ formatDebt(item) }} </b>
                    <span class="currency-light">{{ $defi.getTokenSymbol(item) }}</span>
                </template>
            </template>

            <template v-slot:column-balance_fusd="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        deposit: <b>{{ formatCollateralFUSD(item) }}</b> <br />
                        borrowed: <b>{{ formatDebtFUSD(item) }}</b>
                    </div>
                </div>
                <template v-else>
                    deposit: <b>{{ formatCollateralFUSD(item) }}</b> <br />
                    borrowed: <b>{{ formatDebtFUSD(item) }}</b>
                </template>
            </template>
        </f-data-table>
    </div>
</template>

<script>
import FDataTable from '@/components/core/FDataTable/FDataTable.vue';
import FCryptoSymbol from '@/components/core/FCryptoSymbol/FCryptoSymbol.vue';
import { numberSort, stringSort } from '@/utils/array-sorting.js';

export default {
    name: 'OpenPositionsList',

    components: { FCryptoSymbol, FDataTable },

    props: {
        /** @type {DefiToken[]} */
        tokens: {
            type: Array,
            required: true,
            default() {
                return [];
            },
        },
        /** @type {DefiAccount} */
        defiAccount: {
            type: Object,
            default() {
                return {
                    collateral: [],
                    debt: [],
                };
            },
        },
    },

    data() {
        return {
            items: [],
            /** @type {DeFi} */
            defi: this.$defi,
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
                    name: 'balance',
                    label: 'Balance',
                    // css: { textAlign: 'right' },
                },
                {
                    name: 'balance_fusd',
                    label: 'Balance (fUSD)',
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
                    // css: { textAlign: 'right' },
                },
            ],
        };
    },

    watch: {
        /**
         * @param {DefiToken[]} _value
         */
        tokens(_value) {
            this.items = _value.filter((_item) => _item.isActive && _item.canDeposit && _item.symbol !== 'FTM');
        },
    },

    methods: {
        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        getDebt(_token) {
            /** @type {DefiTokenBalance} */
            const tokenBalance = this.$defi.getDefiAccountDebt(this.defiAccount, _token);

            return this.$defi.fromTokenValue(tokenBalance.balance, _token) || 0;
        },

        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        formatDebt(_token) {
            const debt = this.getDebt(_token);

            return debt > 0 ? debt.toFixed(5) : 0;
        },

        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        formatDebtFUSD(_token) {
            const debt = this.getDebt(_token);

            return debt > 0 ? (debt * this.defi.getTokenPrice(_token)).toFixed(2) : 0;
        },

        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        getCollateral(_token) {
            /** @type {DefiTokenBalance} */
            const tokenBalance = this.$defi.getDefiAccountCollateral(this.defiAccount, _token);

            return this.$defi.fromTokenValue(tokenBalance.balance, _token) || 0;
        },

        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        formatCollateral(_token) {
            const collateral = this.getCollateral(_token);

            return collateral > 0 ? collateral.toFixed(5) : 0;
        },

        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        formatCollateralFUSD(_token) {
            const collateral = this.getCollateral(_token);

            return collateral > 0 ? (collateral * this.defi.getTokenPrice(_token)).toFixed(2) : 0;
        },

        onRowAction(_item) {
            this.$router.push({ name: 'defi-manage-borrow', params: { token: _item } });
        },
    },
};
</script>
