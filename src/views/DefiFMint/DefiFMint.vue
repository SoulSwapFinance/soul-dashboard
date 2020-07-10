<template>
    <div class="view-defi-fmint">
        <h1 class="">Mint and repay fUSD</h1>

        <div class="grid">
            <div>
                <div class="df-data-item smaller">
                    <h3 class="label">Minted fUSD</h3>
                    <div class="value">{{ debt }} <span class="currency">fUSD</span></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Locked FTM</h3>
                    <div class="value">{{ collateral }} <span class="currency">FTM</span></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Available FTM</h3>
                    <div class="value">{{ availableFTM }} <span class="currency">FTM</span></div>
                </div>
            </div>
            <div class="limit-col align-center">
                <h2>Minting limit</h2>
                <f-circle-progress
                    show-percentage
                    :stroke-width="6"
                    :animate="false"
                    :colors="circleColors"
                    :value="mintingLimit"
                />
            </div>
            <div class="align-right">
                <div class="df-data-item smaller">
                    <h3 class="label">Current price</h3>
                    <div class="value">{{ currentPrice }}</div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Liquidation price</h3>
                    <div class="value">{{ liquidationPrice }}</div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Max mintable</h3>
                    <div class="value">{{ maxMintable }} <span class="currency">fUSD</span></div>
                </div>
            </div>
            <f-message v-if="closeToLiquidation" type="error" role="alert">
                You're getting close to your liquidation price. <br />
                Please rebalance your collateral.
            </f-message>
        </div>

        <div class="form-buttons">
            <router-link :to="{ name: 'defi-manage-collateral' }" class="btn large">
                Manage collateral
            </router-link>
            <button class="btn large" disabled>Mint fUSD</button>
            <button class="btn large" disabled>Repay</button>
        </div>

        <div style="margin-top: 32px; opacity: 0.75;">
            <!--            {{ tmpValues }} <br />-->
            <button class="btn small light break-word" @click="onTest1BtnClick">
                Locked balance: 0, Minted fUSD: 0
            </button>
            <br />
            <button class="btn small light break-word" @click="onTest2BtnClick">
                Locked balance: 10000, Minted fUSD: 20
            </button>
            <br />
            <button class="btn small light break-word" @click="onTest3BtnClick">
                Locked balance: 5000, Minted fUSD: 20
            </button>
            <br />
            <button class="btn small light break-word" @click="onTest4BtnClick">
                Locked balance: 5000, Minted fUSD: 20, Current price: 0.008
            </button>
            <br />
        </div>

        <!--
        <defi-menu v-else>
            <li class="col-4">
                <div class="menu-item disabled">
                    <h2>Manage collateral</h2>
                    <div class="icon">
                        <icon data="@/assets/svg/defi/mint.svg" width="96" height="96" />
                    </div>
                    <p class="description">Lock FTM to use it as collateral and mint fUSD</p>
                    <div class="title">Coming Soon</div>
                </div>
            </li>
            <li class="col-4">
                <div class="menu-item" tabindex="0">
                    <h2>Mint</h2>
                    <div class="icon">
                        <icon data="@/assets/svg/defi/mint.svg" width="96" height="96" />
                    </div>
                    <p class="description">Mint fUSD by locking your FTM</p>
                    <router-link :to="{ name: 'defi-mint' }" class="clickable title">
                        Mint fUSD
                    </router-link>
                </div>
            </li>
            <li class="col-4">
                <div class="menu-item disabled" tabindex="0">
                    <h2>Repay</h2>
                    <div class="icon">
                        <icon data="@/assets/svg/defi/repay.svg" width="96" height="96" />
                    </div>
                    <p class="description">Repay the fUSD you minted and unlock your FTM</p>
                    <div class="title">Coming Soon</div>
                </div>
            </li>
        </defi-menu>
        -->
    </div>
</template>

<script>
import FCircleProgress from '../../components/core/FCircleProgress/FCircleProgress.vue';
import { formatNumberByLocale } from '../../filters.js';
import { mapGetters } from 'vuex';
import { toFTM } from '../../utils/transactions.js';
import FMessage from '../../components/core/FMessage/FMessage.vue';

export default {
    name: 'DefiFMint',

    components: { FMessage, FCircleProgress },

    data() {
        return {
            tmpValues: {
                collateral: 0,
                debt: 0,
            },
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        debt() {
            return this.tmpValues.debt;
        },

        collateral() {
            return this.tmpValues.collateral;
        },

        availableFTM() {
            const available = this.currentAccount ? this.currentAccount.balance : 0;

            return toFTM(available);
        },

        currentPrice() {
            return formatNumberByLocale(this.tokenPrice, 5, 'USD');
        },

        liquidationPrice() {
            const liqPrice = this.$defi.getLiquidationPrice(this.debt, this.collateral);

            return liqPrice > 0 ? formatNumberByLocale(liqPrice, 5, 'USD') : '-';
        },

        maxMintable() {
            return this.$defi.getMaxDebt(this.collateral, this.tokenPrice).toFixed(2);
        },

        mintingLimit() {
            return this.$defi.getMintingLimit(this.debt, this.collateral, this.tokenPrice);
        },

        closeToLiquidation() {
            const { $defi } = this;

            return (
                $defi.getRatioMintingLimit($defi.getCollateralRatio(this.debt, this.collateral, this.tokenPrice)) >
                $defi.getRatioMintingLimit($defi.minCollateralRatio)
            );
        },

        circleColors() {
            const { $defi } = this;

            return [
                /*
                {
                    value: 23,
                    color: '#15cd72',
                },
                */
                {
                    value: $defi.getRatioMintingLimit($defi.minCollateralRatio + $defi.liqCollateralRatio),
                    color: '#ffaf19',
                },
                {
                    value: $defi.getRatioMintingLimit($defi.minCollateralRatio),
                    color: '#ff1716',
                },
            ];
        },

        /**
         * Property is set to `true`, if 'small' breakpoint is reached.
         *
         * @return {Boolean}
         */
        /*
        smallView() {
            const breakpoint = this.$store.state.breakpoints['small'];

            return breakpoint && breakpoint.matches;
        },
        */
    },

    asyncComputed: {
        async tokenPrice() {
            return this.tmpValues.tokenPrice || (await this.$defi.getTokenPrice('USD'));
        },
    },

    methods: {
        onTest1BtnClick() {
            this.tmpValues = {
                collateral: 0,
                debt: 0,
            };
        },

        onTest2BtnClick() {
            this.tmpValues = {
                collateral: 10000,
                debt: 20,
            };
        },

        onTest3BtnClick() {
            this.tmpValues = {
                collateral: 5000,
                debt: 20,
            };
        },

        onTest4BtnClick() {
            this.tmpValues = {
                collateral: 5000,
                debt: 20,
                tokenPrice: 0.008,
            };
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
