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
                        <b>{{ balance }}</b> {{ tokenSymbol }}
                    </div>
                </div>
                <div class="row no-collapse align-items-center">
                    <div class="col-5 light-text-color fs-80">Deposited</div>
                    <div class="col-7 flenduserinfo_value">
                        <b>{{ deposited }}</b> {{ tokenSymbol }}
                    </div>
                </div>
                <div class="row no-collapse align-items-center">
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
                        <b>{{ borrowed }}</b> {{ tokenSymbol }}
                    </div>
                </div>
                <div class="row no-collapse align-items-center">
                    <div class="col-5 light-text-color fs-80">Health factor <f-lend-health-factor-info /></div>
                    <div class="col-7 flenduserinfo_value">
                        <b>{{ healthFactor }}</b>
                    </div>
                </div>
                <div class="row no-collapse align-items-center">
                    <div class="col-5 light-text-color fs-80">Loan to value</div>
                    <div class="col-7 flenduserinfo_value">
                        <b>{{ loanToValue }}</b> %
                    </div>
                </div>
                <div class="row no-collapse align-items-center">
                    <div class="col-5 light-text-color fs-80">Available to you</div>
                    <div class="col-7 flenduserinfo_value">
                        <b>{{ available }}</b> {{ tokenSymbol }}
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
            balance: '9,900.00',
            deposited: '100.00',
            borrowed: '0.00',
            healthFactor: '-',
            loanToValue: 79.7,
            available: '1,340.26',
            usedAsCollateral: true,
        };
    },

    computed: {
        tokenSymbol() {
            return this.$defi.getTokenSymbol(this.reserve.asset);
        },

        canDeposit() {
            return true;
        },

        canWithdraw() {
            return false;
        },

        canBorrow() {
            return false;
        },
    },

    watch: {
        usedAsCollateral(_value) {
            console.log('usedAsCollateral change', _value);
        },
    },

    methods: {
        onBorrowClick() {},
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
