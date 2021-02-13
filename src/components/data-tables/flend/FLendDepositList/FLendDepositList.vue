<template>
    <div class="flenddepositlist">
        <f-data-table
            :columns="columns"
            :items="items"
            :loading="loading"
            first-m-v-column-width="6"
            f-card-off
            action-on-row
            class="f-data-table-body-bg-color"
            @row-action="onRowAction"
        >
            <template v-slot:column-asset="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        <f-crypto-symbol :token="item.erc20Info" />
                    </div>
                </div>
                <template v-else>
                    <f-crypto-symbol :token="item.erc20Info" />
                </template>
            </template>
        </f-data-table>
    </div>
</template>

<script>
import FDataTable from '@/components/core/FDataTable/FDataTable.vue';
import FCryptoSymbol from '@/components/core/FCryptoSymbol/FCryptoSymbol.vue';
import { stringSort } from '@/utils/array-sorting.js';
import { mapGetters } from 'vuex';
import { formatNumberByLocale } from '@/filters.js';
import { MAX_TOKEN_DECIMALS_IN_TABLES } from '@/plugins/fantom-web3-wallet.js';
// import {formatNumberByLocale} from "@/filters.js";
// import {MAX_TOKEN_DECIMALS_IN_TABLES} from "@/plugins/fantom-web3-wallet.js";

export default {
    name: 'FLendDepositList',

    components: { FCryptoSymbol, FDataTable },

    data() {
        return {
            items: [],
            columns: [
                {
                    name: 'asset',
                    label: 'Asset',
                    sortFunc: (_itemProp, _direction = 'asc') => {
                        return (_a, _b) => {
                            const a = _a.erc20Info.symbol;
                            const b = _b.erc20Info.symbol;

                            return (_direction === 'desc' ? -1 : 1) * stringSort(a, b);
                        };
                    },
                    sortDir: 'desc',
                    width: '180px',
                },
                {
                    name: 'balance',
                    label: 'Your wallet balance',
                    itemProp: 'erc20Info.balanceOf',
                    formatter: (_availableBalance, _item) => {
                        const balance = this.$defi.fromTokenValue(_availableBalance, _item.erc20Info);

                        return balance > 0
                            ? formatNumberByLocale(
                                  balance,
                                  this.$defi.getTokenDecimals(_item.erc20Info, MAX_TOKEN_DECIMALS_IN_TABLES)
                              )
                            : 0;
                    },
                },
                {
                    name: 'deposits',
                    label: 'Your deposits',
                    formatter: () => {
                        return '-';
                    },
                },
                {
                    name: 'depositapy',
                    label: 'Deposit APY',
                    itemProp: 'currentLiquidityRate',
                    formatter: (_value) => {
                        return _value;
                    },
                },
            ],
            loading: true,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    created() {
        this.init();
    },

    methods: {
        async init() {
            const reserves = await this.$flend.fetchReservesWithERC20Info(
                this.currentAccount ? this.currentAccount.address : ''
            );

            this.loading = false;
            this.items = reserves;
        },

        /**
         * @param {{proposal: GovernanceProposal}} _item
         */
        onRowAction(_item) {
            this.$router.push({
                name: 'f-lend-deposit-detail',
                params: {
                    assetAddress: _item.assetAddress,
                },
            });
        },
    },
};
</script>
