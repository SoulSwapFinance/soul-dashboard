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
                    <div class="col-5 light-text-color fs-80">
                        Use as collateral
                        <f-info
                            window-closeable
                            window-class="light"
                            window-style="max-width: 550px;"
                            window-title="Adding and removing assets as collateral"
                            icon-size="16"
                            class="debt-limit-f-info"
                        >
                            <p>
                                Allows you to decide whether to use a deposited asset as collateral. An asset used as
                                collateral will affect your borrowing power and health factor
                            </p>
                        </f-info>
                    </div>
                    <div class="col-7 flenduserinfo_value"><f-toggle-button v-model="usedAsCollateral" /></div>
                </div>
                <div class="flenduserinfo_buttons">
                    <button class="btn small" :disabled="depositDisabled" @click="onDepositClick">Deposit</button>
                    &nbsp;
                    <button class="btn small" :disabled="withdrawDisabled" @click="onWithdrawClick">Withdraw</button>
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
                    <div class="col-5 light-text-color fs-80">
                        Health factor
                        <f-info
                            window-closeable
                            window-class="light"
                            window-style="max-width: 400px;"
                            window-title="Health factor"
                            icon-size="16"
                            class="debt-limit-f-info"
                        >
                            <p>
                                The health factor represents the safety of your loan derived from the proportion of
                                collateral versus amount borrowed. Keep it above 1 to avoid liquidation.
                            </p>
                        </f-info>
                    </div>
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
                    <button class="btn small" :disabled="borrowDisabled" @click="onBorrowClick">Borrow</button>
                </div>
            </f-card>
        </div>
    </div>
</template>

<script>
import FCard from '@/components/core/FCard/FCard.vue';
import FToggleButton from '@/components/core/FToggleButton/FToggleButton.vue';
import FInfo from '@/components/core/FInfo/FInfo.vue';

export default {
    name: 'FLendUserInfo',

    components: { FInfo, FToggleButton, FCard },

    props: {
        /** @type {FLendReserve} */
        reserve: {
            type: Object,
            default() {
                return {
                    erc20Info: {},
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
            return this.$defi.getTokenSymbol(this.reserve.erc20Info);
        },

        depositDisabled() {
            return true;
        },

        withdrawDisabled() {
            return true;
        },

        borrowDisabled() {
            return true;
        },
    },

    watch: {
        usedAsCollateral(_value) {
            console.log('usedAsCollateral change', _value);
        },
    },

    methods: {
        onDepositClick() {},

        onWithdrawClick() {},

        onBorrowClick() {},
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
