<template>
    <div class="flenddepositlist">
        <f-data-table
            ref="dataTable"
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

            <template v-slot:column-balance="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        {{ value }} <br />
                        <span class="light-text-color">{{ getAssetPriceF(value, item.asset) }}</span>
                    </div>
                </div>
                <template v-else>
                    {{ value }} <br />
                    <span class="light-text-color">{{ getAssetPriceF(value, item.asset) }}</span>
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
import { sortByHex, sortByNumber, stringSort } from '@/utils/array-sorting.js';
import { mapGetters } from 'vuex';
import { formatNumberByLocale } from '@/filters.js';
import { MAX_TOKEN_DECIMALS_IN_TABLES } from '@/plugins/fantom-web3-wallet.js';
import { bFromWei } from '@/utils/bignumber.js';
import { eventBusMixin } from '@/mixins/event-bus.js';
// import {formatNumberByLocale} from "@/filters.js";
// import {MAX_TOKEN_DECIMALS_IN_TABLES} from "@/plugins/fantom-web3-wallet.js";

export default {
    name: 'FLendDepositList',

    components: { FCryptoSymbol, FDataTable },

    mixins: [eventBusMixin],

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
                    width: '180px',
                },
                {
                    name: 'balance',
                    label: 'Your wallet balance',
                    itemProp: '_availableBalance',
                    sortDir: 'desc',
                    sortItemProp: '_availableBalanceFUSD',
                    sortFunc: sortByHex,
                    formatter: (_availableBalance, _item) => {
                        return _availableBalance > 0
                            ? formatNumberByLocale(
                                  _availableBalance,
                                  this.$defi.getTokenDecimals(_item.asset, MAX_TOKEN_DECIMALS_IN_TABLES)
                              )
                            : 0;
                    },
                },
                {
                    name: 'deposits',
                    label: 'Your deposits',
                    itemProp: '_deposit',
                    sortFunc: sortByNumber,
                    formatter: (_value, _item) => {
                        return _value > 0
                            ? formatNumberByLocale(
                                  _value,
                                  this.$defi.getTokenDecimals(_item.asset, MAX_TOKEN_DECIMALS_IN_TABLES)
                              )
                            : 0;
                    },
                },
                {
                    name: 'depositapy',
                    label: 'Deposit APY',
                    itemProp: 'currentLiquidityRate',
                    sortFunc: sortByHex,
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
            // length of reserves
            reservesLen: 0,
            // keys are reserve IDs, values are aTokenAdresses
            aTokenAdresses: {},
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    created() {
        this.init();

        this._eventBus.on('account-picked', this.onAccountPicked);
    },

    methods: {
        async init() {
            const { $flend } = this;
            const { $defi } = this;
            let reserves = await this.$flend.fetchReservesWithERC20Info(
                this.currentAccount ? this.currentAccount.address : ''
            );

            this.loading = false;

            // set this.aTokenAddress
            reserves.forEach((_reserve) => {
                this.aTokenAdresses[_reserve.ID] = _reserve.aTokenAddress;
            });

            // store original reserves length
            this.reservesLen = reserves.length;

            reserves = reserves.map((_reserve) => {
                const availableBalance = $defi.fromTokenValue(_reserve.asset.availableBalance, _reserve.asset);

                return {
                    ..._reserve,
                    _config: $flend.getReserveConfigurationData(_reserve.configuration),
                    _deposit: 0,
                    _availableBalance: availableBalance,
                    _availableBalanceFUSD: availableBalance * this.getAssetPrice(_reserve.asset),
                };
            });

            this.items = reserves.filter((_reserve) => _reserve._config.isActive);

            this.setDeposits();
        },

        async setDeposits() {
            const { $flend } = this;
            const { aTokenAdresses } = this;
            const userData = await $flend.fetchUserData(this.currentAccount.address);
            const userConfig = $flend.getUserConfiguration(userData.configurationData, this.reservesLen);
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

                // re-sort table by the third column
                // this.$refs.dataTable.sortByColumnIndex(2);
            }
        },

        /**
         * @param {DefiToken} _asset
         * @return {number}
         */
        getAssetPrice(_asset) {
            return this.$defi.getTokenPrice(_asset);
        },

        /**
         * @param {number} _value
         * @param {DefiToken} _asset
         * @return {number}
         */
        getAssetPriceF(_value, _asset) {
            return this.$defi.formatValueInUSD(_value, _asset, 2);
        },

        /**
         * @param {FLendReserve} _reserve
         * @return {boolean}
         */
        canWithdraw(_reserve) {
            return _reserve._deposit > 0;
        },

        onAccountPicked() {
            this.init();
        },
    },
};
</script>
