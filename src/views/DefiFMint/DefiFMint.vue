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

        <div
            v-if="tmpShow"
            style="margin-top: 32px; padding-top: 16px; opacity: 0.75; border-top: 1px solid #ddd;"
            @click="onTestBtnClick"
        >
            <h3>Test values</h3>
            <h4>Common values</h4>
            <p>
                Liquidation collateral ratio: 1.5 <br />
                Minimal collateral ratio: 2.5 <br />
                Token price: {{ tokenPrice }}
            </p>
            <div v-for="(item, index) in tmpTestData" :key="`td${id}${index}`">
                <button :data-idx="index" class="btn small light break-word">
                    Locked balance: {{ item.collateral }}, Minted fUSD: {{ item.debt }}
                    <template v-if="item.tokenPrice"> , Current price: {{ item.tokenPrice }} </template>
                </button>
                <br />
            </div>
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
import { getUniqueId } from '../../utils';

export default {
    name: 'DefiFMint',

    components: { FMessage, FCircleProgress },

    data() {
        return {
            tokenPrice: 0,
            id: getUniqueId(),
            tmpShow: true,
            tmpTokenPrice: 0,
            tmpValues: {
                collateral: 0,
                debt: 0,
            },
            tmpTestData: [
                { collateral: 0, debt: 0 },
                { collateral: 10000, debt: 20 },
                { collateral: 5000, debt: 20 },
                { collateral: 5000, debt: 20, tokenPrice: 0.008 },
            ],
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

    created() {
        this.init();
    },

    methods: {
        async init() {
            this.tokenPrice = await this.$defi.getTokenPrice('USD');
            this.tmpTokenPrice = this.tokenPrice;
            console.log('init', this.tokenPrice);
        },

        _setTmpValues(_values) {
            this.tmpValues = {
                collateral: _values.collateral,
                debt: _values.debt,
            };

            if (_values.tokenPrice) {
                this.tokenPrice = _values.tokenPrice;
            } else {
                this.tokenPrice = this.tmpTokenPrice;
            }
        },

        onTestBtnClick(_event) {
            const eBtn = _event.target.closest('button');
            let idx = -1;

            if (eBtn) {
                idx = parseInt(eBtn.getAttribute('data-idx'));
                if (!isNaN(idx)) {
                    this._setTmpValues(this.tmpTestData[idx]);
                }
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
