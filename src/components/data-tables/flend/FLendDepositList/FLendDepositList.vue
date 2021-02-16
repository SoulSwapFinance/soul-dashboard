<template>
    <div class="flenddepositlist">
        <f-data-table
            :columns="columns"
            :items="items"
            :loading="loading"
            first-m-v-column-width="6"
            f-card-off
            class="f-data-table-body-bg-color"
        >
            <template v-slot:column-asset="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        <f-crypto-symbol :token="item.asset" />
                    </div>
                </div>
                <template v-else>
                    <f-crypto-symbol :token="item.asset" />
                </template>
            </template>

            <template v-slot:column-actions="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        <router-link
                            :to="{ name: 'f-lend-deposit-detail', params: { assetAddress: item.assetAddress } }"
                        >
                            Deposit
                        </router-link>
                        ,
                        <router-link
                            v-if="canWithdraw(item)"
                            :to="{ name: 'f-lend-withdraw-detail', params: { assetAddress: item.assetAddress } }"
                        >
                            Withdraw
                        </router-link>
                    </div>
                </div>
                <template v-else>
                    <router-link :to="{ name: 'f-lend-deposit-detail', params: { assetAddress: item.assetAddress } }">
                        Deposit
                    </router-link>
                    <router-link
                        v-if="canWithdraw(item)"
                        :to="{ name: 'f-lend-withdraw-detail', params: { assetAddress: item.assetAddress } }"
                    >
                        Withdraw
                    </router-link>
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
import { bFromWei } from '@/utils/bignumber.js';
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
                            const a = _a.asset.symbol;
                            const b = _b.asset.symbol;

                            return (_direction === 'desc' ? -1 : 1) * stringSort(a, b);
                        };
                    },
                    sortDir: 'desc',
                    width: '180px',
                },
                {
                    name: 'balance',
                    label: 'Your wallet balance',
                    itemProp: 'asset.availableBalance',
                    formatter: (_availableBalance, _item) => {
                        const balance = this.$defi.fromTokenValue(_availableBalance, _item.asset);

                        return balance > 0
                            ? formatNumberByLocale(
                                  balance,
                                  this.$defi.getTokenDecimals(_item.asset, MAX_TOKEN_DECIMALS_IN_TABLES)
                              )
                            : 0;
                    },
                },
                {
                    name: 'deposits',
                    label: 'Your deposits',
                    itemProp: '_deposit',
                    formatter: (_value) => {
                        return _value || 0;
                    },
                },
                {
                    name: 'depositapy',
                    label: 'Deposit APY',
                    itemProp: 'currentLiquidityRate',
                    formatter: (_value) => {
                        return _value + ' ??';
                    },
                },
                {
                    name: 'actions',
                    label: 'Actions',
                    width: '120px',
                    css: { textAlign: 'right' },
                },
            ],
            loading: true,
            aTokenAdresses: [],
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
            const { $flend } = this;
            let reserves = await this.$flend.fetchReservesWithERC20Info(
                this.currentAccount ? this.currentAccount.address : ''
            );

            this.loading = false;
            this.aTokenAdresses = reserves.map((_reserve) => _reserve.aTokenAddress);

            reserves = reserves.map((_reserve) => {
                return { ..._reserve, _config: $flend.getReserveConfigurationData(_reserve.configuration) };
            });
            this.items = reserves.filter((_reserve) => _reserve._config.isActive);

            this.setDeposits();
        },

        async setDeposits() {
            const { $flend } = this;
            const { aTokenAdresses } = this;
            const userData = await $flend.fetchUserData(this.currentAccount.address);
            const userConfig = $flend.getUserConfiguration(userData.configurationData, this.aTokenAdresses.length);
            const reservesUsedAsCollateral = $flend.getUserReservesIndices(userConfig);

            let deposit = null;
            let aTokenAddress = '';
            let item = null;

            if (reservesUsedAsCollateral.length > 0) {
                for (let i = 0, len1 = reservesUsedAsCollateral.length; i < len1; i++) {
                    aTokenAddress = aTokenAdresses[reservesUsedAsCollateral[i]];

                    deposit = await $flend.fetchERC20TokenBalance(this.currentAccount.address, aTokenAddress);

                    item = this.items.find((_item) => _item.aTokenAddress === aTokenAddress);
                    if (item) {
                        this.$set(item, '_deposit', bFromWei(deposit).toNumber());
                    }
                }
            }
        },

        /**
         * @param {FLendReserve} _reserve
         * @return {boolean}
         */
        canWithdraw(_reserve) {
            return _reserve._deposit > 0;
        },
    },
};
</script>
