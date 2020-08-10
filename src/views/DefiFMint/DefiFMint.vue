<template>
    <div class="view-defi-fmint">
        <h1 class="with-back-btn"><f-back-button :route-name="backButtonRoute" /> fMint</h1>

        <h2 class="perex">Manage your collateral and minted fUSD</h2>

        <div class="grid">
            <div>
                <h2>
                    <router-link :to="{ name: 'defi-manage-collateral' }" class="btn secondary large btn-large-font">
                        Lock FTM
                    </router-link>
                </h2>
                <div class="df-data-item smaller">
                    <h3 class="label">Available FTM</h3>
                    <div class="value">{{ availableFTM }} <span class="currency">FTM</span></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Locked FTM</h3>
                    <div class="value">{{ collateral.toFixed(2) }} <span class="currency">FTM</span></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Current FTM price</h3>
                    <div class="value">{{ currentPrice }}</div>
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
                    :value="debtLimit"
                />
            </div>
            <div class="align-right">
                <h2>
                    <router-link :to="{ name: 'defi-borrow-fusd' }" class="btn secondary large btn-large-font">
                        Mint fUSD
                    </router-link>
                </h2>
                <div class="df-data-item smaller">
                    <h3 class="label">Max mintable</h3>
                    <div class="value">{{ maxMintable.toFixed(2) }} <span class="currency">fUSD</span></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Minted fUSD</h3>
                    <div class="value">{{ debtFUSD.toFixed(3) }} <span class="currency">fUSD</span></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Liquidation price</h3>
                    <div class="value">{{ liquidationPrice }}</div>
                </div>
            </div>
            <f-message v-if="closeToLiquidation" type="error" role="alert" class="big">
                You're getting close to your liquidation price. <br />
                Please rebalance your collateral.
            </f-message>
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

        debtFUSD() {
            /** @type {DefiToken} */
            const token = this.tokens.find((_item) => _item.symbol === 'FUSD');
            /** @type {DefiTokenBalance} */
            const tokenBalance = this.$defi.getDefiAccountDebt(this.defiAccount, token);

            return this.$defi.fromTokenValue(tokenBalance.balance, token) || 0;
        },

        collateral() {
            /** @type {DefiTokenBalance} */
            const tokenBalance = this.$defi.getDefiAccountCollateral(this.defiAccount, this.ftmToken);

            return this.$defi.fromTokenValue(tokenBalance.balance, this.ftmToken) || 0;
        },

        availableFTM() {
            const available = this.currentAccount ? this.currentAccount.balance : 0;

            return toFTM(available);
        },

        currentPrice() {
            return formatNumberByLocale(this.tokenPrice, 5, 'USD');
        },

        liquidationPrice() {
            return '-';
            /*
            const liqPrice = this.$defi.getLiquidationPrice(this.debt, this.collateral);

            return liqPrice > 0 ? formatNumberByLocale(liqPrice, 5, 'USD') : '-';
            */
        },

        availableBalance() {
            return this.ftmToken ? this.$defi.fromTokenValue(this.ftmToken.availableBalance, this.ftmToken) || 0 : 0;
        },

        maxMintable() {
            return (
                this.debtFUSD +
                Math.min(
                    this.availableBalance * this.tokenPrice,
                    this.$defi.getBorrowLimit(this.defiAccount) / this.tokenPrice
                )
            );
            // return this.$defi.getMaxDebt(this.collateral, this.tokenPrice).toFixed(2);
        },

        debtLimit() {
            return this.$defi.getDebtLimit(this.defiAccount);
        },

        closeToLiquidation() {
            const { $defi } = this;

            return this.debtLimit > ($defi.warningCollateralRatio / $defi.minCollateralRatio) * 100;
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
        },

        onAccountPicked() {
            this.init();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
