<template>
    <div class="view-defi-fmint">
        <h1 class="with-back-btn"><f-back-button :route-name="backButtonRoute" /> fMint</h1>

        <h2 class="perex">Manage your collateral and minted fUSD</h2>

        <div class="grid">
            <div>
                <div class="df-data-item smaller">
                    <h3 class="label">Minted fUSD</h3>
                    <div class="value">{{ debt.toFixed(3) }} <span class="currency">fUSD</span></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Locked FTM</h3>
                    <div class="value">{{ collateral.toFixed(2) }} <span class="currency">FTM</span></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Available FTM</h3>
                    <div class="value">{{ availableFTM }} <span class="currency">FTM</span></div>
                </div>
            </div>
            <div class="limit-col align-center">
                <h2>
                    Debt Limit
                    <f-info window-closeable window-class="light"
                        >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aperiam culpa dicta
                        numquam, ratione repellat sequi voluptate! Accusamus accusantium corporis dolores enim quas rem
                        sed voluptas? Animi atque labore obcaecati.</f-info
                    >
                </h2>
                <f-circle-progress
                    show-percentage
                    :stroke-width="6"
                    :animate="false"
                    :colors="colors"
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
            <f-message v-if="closeToLiquidation" type="error" role="alert" class="big">
                You're getting close to your liquidation price. <br />
                Please rebalance your collateral.
            </f-message>
        </div>

        <div class="form-buttons">
            <router-link :to="{ name: 'defi-manage-collateral' }" class="btn large">
                Manage collateral
            </router-link>
            <router-link :to="{ name: 'defi-borrow-fusd' }" class="btn large">
                Manage fUSD
            </router-link>
        </div>

        <div
            v-if="tmpShow"
            style="margin-top: 48px; padding: 16px; opacity: 0.75; background-color: #eee;"
            @click="onTestBtnClick"
        >
            <h3>Test values</h3>
            <h4>Common values</h4>
            <p>
                Liquidation collateral ratio: {{ $defi.liqCollateralRatio }} <br />
                Minimal collateral ratio: {{ $defi.minCollateralRatio }} <br />
                Token price: {{ tokenPrice }}
            </p>
            <h4>Set values</h4>
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
                    <router-link :to="{ name: 'defi-borrow-fusd' }" class="clickable title">
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
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '../../app-structure.js';
import { eventBusMixin } from '../../mixins/event-bus.js';
import FInfo from '../../components/core/FInfo/FInfo.vue';

export default {
    name: 'DefiFMint',

    components: { FInfo, FBackButton, FMessage, FCircleProgress },

    mixins: [eventBusMixin],

    data() {
        return {
            tokenPrice: 0,
            /** @type {DefiAccount} */
            defiAccount: {
                collateral: [],
                debt: [],
            },
            /** @type {DefiToken} */
            ftmToken: null,
            /** @type {DefiToken[]} */
            tokens: [],
            id: getUniqueId(),
            tmpShow: false,
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
                { collateral: 5000, debt: 20, tokenPrice: 0.007 },
            ],
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        debt() {
            // overall debt
            return this.$defi.fromTokenValue(
                this.defiAccount.debtValue,
                this.tokens.find((_item) => _item.symbol === 'FUSD')
            );
        },

        collateral() {
            /** @type {DefiTokenBalance} */
            const tokenBalance = this.$defi.getDefiAccountCollateral(this.defiAccount, this.ftmToken);

            return this.$defi.fromTokenValue(tokenBalance.balance, this.ftmToken) || 0;
        },

        /*
        debt() {
            return this.tmpValues.debt;
        },

        collateral() {
            return this.tmpValues.collateral;
        },
        */

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

            return this.mintingLimit > ($defi.warningCollateralRatio / $defi.minCollateralRatio) * 100;
        },

        colors() {
            return this.$defi.getColors();
        },

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-fmint');

            return parentNode ? parentNode.route : '';
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

        this._eventBus.on('account-picked', this.onAccountPicked);
    },

    methods: {
        async init() {
            const { $defi } = this;
            const result = await Promise.all([
                $defi.fetchDefiAccount(this.currentAccount.address),
                $defi.fetchTokens(this.currentAccount.address),
                $defi.init(),
            ]);

            this.defiAccount = result[0];
            this.tokens = result[1];
            this.ftmToken = this.tokens.find((_item) => _item.symbol === 'FTM');
            this.tokenPrice = $defi.getTokenPrice(this.ftmToken);

            this.tmpTokenPrice = this.tokenPrice;
        },

        onAccountPicked() {
            this.init();
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
