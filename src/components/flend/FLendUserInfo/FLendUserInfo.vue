<template>
    <div class="flenduserinfo gridauto">
        <div class="flenduserinfo_deposits">
            <f-card>
                <div class="flenduserinfo_label">
                    Deposits
                </div>
                <div class="row no-collapse align-items-center">
                    <div class="col-5 light-text-color fs-80">Balance</div>
                    <div class="col-7 flenduserinfo_value">
                        <b>{{ formatAmount(balance) }}</b> {{ tokenSymbol }}
                    </div>
                </div>
                <div class="row no-collapse align-items-center">
                    <div class="col-5 light-text-color fs-80">Deposited</div>
                    <div class="col-7 flenduserinfo_value">
                        <b>{{ formatAmount(deposited) }}</b> {{ tokenSymbol }}
                    </div>
                </div>
                <div v-if="deposited && reserveUsedAsCollateral" class="row no-collapse align-items-center">
                    <div class="col-5 light-text-color fs-80">Use as collateral <f-lend-collateral-info /></div>
                    <div class="col-7 flenduserinfo_value"><f-toggle-button v-model="usedAsCollateral" /></div>
                </div>
                <div class="flenduserinfo_buttons">
                    <router-link
                        v-if="canDeposit && reserve.assetAddress"
                        :to="{ name: 'f-lend-deposit-detail', params: { assetAddress: reserve.assetAddress } }"
                        class="btn small"
                    >
                        Deposit
                    </router-link>
                    <button v-else disabled class="btn small">Deposit</button>
                    &nbsp;
                    <router-link
                        v-if="canWithdraw && reserve.assetAddress"
                        :to="{
                            name: 'f-lend-withdraw-detail',
                            params: { assetAddress: reserve.assetAddress },
                        }"
                        class="btn small"
                    >
                        Withdraw
                    </router-link>
                    <button v-else disabled class="btn small">Withdraw</button>
                </div>
            </f-card>
        </div>
        <div class="flenduserinfo_borrows">
            <f-card>
                <div class="flenduserinfo_label">Borrows</div>
                <div class="row no-collapse align-items-center">
                    <div class="col-5 light-text-color fs-80">Borrowed</div>
                    <div class="col-7 flenduserinfo_value">
                        <b>{{ formatAmount(borrowed) }}</b> {{ tokenSymbol }} ??
                    </div>
                </div>
                <div class="row no-collapse align-items-center">
                    <div class="col-5 light-text-color fs-80">Health factor <f-lend-health-factor-info /></div>
                    <div class="col-7 flenduserinfo_value">
                        <b>{{ borrowed > 0 ? healthFactor : '-' }} ??</b>
                    </div>
                </div>
                <div class="row no-collapse align-items-center">
                    <div class="col-5 light-text-color fs-80">Loan to value</div>
                    <div class="col-7 flenduserinfo_value">
                        <b>{{ loanToValue }} ??</b> %
                    </div>
                </div>
                <div class="row no-collapse align-items-center">
                    <div class="col-5 light-text-color fs-80">Available to you</div>
                    <div class="col-7 flenduserinfo_value">
                        <b>{{ formatAmount(available) }}</b> {{ tokenSymbol }}
                    </div>
                </div>
                <div class="flenduserinfo_buttons">
                    <router-link
                        v-if="canBorrow && reserve.assetAddress"
                        :to="{
                            name: 'f-lend-borrow-detail',
                            params: { assetAddress: reserve.assetAddress },
                        }"
                        class="btn small"
                    >
                        Borrow
                    </router-link>
                    <button v-else disabled class="btn small">Borrow</button>
                </div>
            </f-card>
        </div>
    </div>
</template>

<script>
import FCard from '@/components/core/FCard/FCard.vue';
import FToggleButton from '@/components/core/FToggleButton/FToggleButton.vue';
import FLendHealthFactorInfo from '@/components/flend/infos/FLendHealthFactorInfo.vue';
import FLendCollateralInfo from '@/components/flend/infos/FLendCollateralInfo.vue';
import { mapGetters } from 'vuex';
import { bFromWei } from '@/utils/bignumber.js';
import { formatNumberByLocale } from '@/filters.js';

export default {
    name: 'FLendUserInfo',

    components: { FLendCollateralInfo, FLendHealthFactorInfo, FToggleButton, FCard },

    props: {
        /** @type {FLendReserve} */
        reserve: {
            type: Object,
            default() {
                return {
                    asset: {},
                };
            },
        },
    },

    data() {
        return {
            balance: 0,
            deposited: 0,
            borrowed: 0,
            healthFactor: 0,
            loanToValue: 0,
            available: 0,
            usedAsCollateral: true,
            reserveConfig: {},
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        tokenSymbol() {
            return this.$defi.getTokenSymbol(this.reserve.asset);
        },

        canDeposit() {
            const { reserveConfig } = this;

            return reserveConfig.isActive;
        },

        canWithdraw() {
            const { reserveConfig } = this;

            return this.deposited > 0 && reserveConfig.isActive;
        },

        canBorrow() {
            const { reserveConfig } = this;

            return reserveConfig.borrowingEnabled && reserveConfig.isActive;
        },

        reserveUsedAsCollateral() {
            // ??
            return true;
        },
    },

    watch: {
        usedAsCollateral(_value) {
            console.log('usedAsCollateral change', _value);
        },

        reserve: {
            immediate: true,
            handler() {
                this.setData();
            },
        },
    },

    methods: {
        async setData() {
            /** @type {FLendReserve} */
            const reserve = this.reserve;
            const { $flend } = this;

            if (!reserve.ID) {
                return;
            }

            const { assetAddress } = reserve;
            const data = await Promise.all([
                $flend.fetchUserData(this.currentAccount.address),
                $flend.fetchERC20TokenBalance(this.currentAccount.address, reserve.aTokenAddress),
                $flend.fetchERC20TokenBalance(this.currentAccount.address, assetAddress),
            ]);
            const userData = data[0];
            const deposit = data[1];
            const userTokenBalance = data[2];

            this.balance = bFromWei(userTokenBalance).toNumber();
            this.deposited = bFromWei(deposit).toNumber();
            // this.borrowed = bFromWei(userData.totalDebtFUSD).toNumber();
            this.healthFactor = $flend.fromRay(userData.healthFactor).toNumber();
            // this.loanToValue = $flend.fromRay(userData.ltv).toNumber();
            this.available = bFromWei(userData.availableBorrowsFUSD)
                .dividedBy(this.$defi.getTokenPrice(reserve.asset))
                .toNumber();

            this.reserveConfig = $flend.getReserveConfigurationData(reserve.configuration);
        },

        formatAmount(_amount) {
            return formatNumberByLocale(_amount, 2);
        },

        onBorrowClick() {},
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
