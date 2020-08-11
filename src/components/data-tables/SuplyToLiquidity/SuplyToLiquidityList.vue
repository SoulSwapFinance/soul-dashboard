<template>
    <div class="suply-to-liquidity-list-dt">
        <f-data-table
            :columns="columns"
            :items="items"
            action-on-row
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
                        {{ value }}
                        <!-- <span class="currency-light">{{ $defi.getTokenSymbol(item) }}</span>-->
                    </div>
                </div>
                <template v-else>
                    {{ value }}
                    <!-- <span class="currency-light">{{ $defi.getTokenSymbol(item) }}</span>-->
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
    name: 'SuplyToLiquidityList',

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
                    itemProp: 'availableBalance',
                    formatter: (_availableBalance, _item) => {
                        const collateral = this.getCollateral(_item);

                        return collateral > 0 ? collateral.toFixed(this.defi.getTokenDecimals(_item)) : 0;
                    },
                    css: { textAlign: 'right' },
                    // width: '100px',
                },
                {
                    name: 'balance_fusd',
                    label: 'Balance (fUSD)',
                    itemProp: 'availableBalance',
                    formatter: (_availableBalance, _item) => {
                        const collateral = this.getCollateral(_item);

                        return collateral > 0
                            ? (collateral * this.defi.getTokenPrice(_item)).toFixed(
                                  this.defi.getTokenDecimals({ symbol: 'FUSD' })
                              )
                            : 0;
                    },
                    sortDir: 'desc',
                    sortFunc: (_itemProp, _direction = 'asc') => {
                        return (_a, _b) => {
                            const a = this.getCollateral(_a) * this.defi.getTokenPrice(_a);
                            const b = this.getCollateral(_b) * this.defi.getTokenPrice(_b);

                            return (_direction === 'desc' ? -1 : 1) * numberSort(a, b);
                        };
                    },
                    css: { textAlign: 'right' },
                    // width: '100px',
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

            this.$emit('records-count', this.items.length);
        },
    },

    methods: {
        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        getCollateral(_token) {
            /** @type {DefiTokenBalance} */
            const tokenBalance = this.$defi.getDefiAccountCollateral(this.defiAccount, _token);

            return this.$defi.fromTokenValue(tokenBalance.balance, _token) || 0;
        },

        onRowAction(_item) {
            this.$router.push({ name: 'defi-manage-deposit', params: { token: _item } });
        },
    },
};
</script>
