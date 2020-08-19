<template>
    <div class="view-defi-fmint">
        <h1 class="with-back-btn"><f-back-button :route-name="backButtonRoute" /> fMint</h1>

        <h2 class="perex">Manage your collateral and minted fUSD</h2>

        <div class="grid">
            <div>
                <h2>Collateral</h2>
                <div class="df-data-item smaller">
                    <h3 class="label">Available {{ wftmTokenSymbol }}</h3>
                    <div class="value"><f-token-value :token="wftmToken" :value="availableFTM" /></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Locked {{ wftmTokenSymbol }}</h3>
                    <div class="value"><f-token-value :token="wftmToken" :value="collateral" /></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Current {{ wftmTokenSymbol }} price</h3>
                    <div class="value">
                        <f-placeholder :content-loaded="!!tokenPrice" replacement-text="$0.00000">
                            {{ currentPrice }}
                        </f-placeholder>
                    </div>
                </div>
            </div>
            <div class="limit-col align-center">
                <h2>Debt Limit <debt-limit-f-info /></h2>
                <f-circle-progress
                    show-percentage
                    :stroke-width="6"
                    :animate="false"
                    :colors="colors"
                    :value="debtLimit"
                />
            </div>
            <div class="align-right">
                <h2>fUSD</h2>
                <div class="df-data-item smaller">
                    <h3 class="label">Max mintable</h3>
                    <div class="value"><f-token-value :token="fusdToken" :value="maxMintable" /></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Minted fUSD</h3>
                    <div class="value"><f-token-value :token="fusdToken" :value="debtFUSD" /></div>
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

        <div class="form-buttons">
            <router-link :to="{ name: 'defi-manage-collateral' }" class="btn large">
                Lock/Unlock {{ wftmTokenSymbol }}
            </router-link>
            <router-link :to="{ name: 'defi-borrow-fusd' }" class="btn large">
                Mint/Repay fUSD
            </router-link>
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
import FMessage from '../../components/core/FMessage/FMessage.vue';
import { getUniqueId } from '../../utils';
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '../../app-structure.js';
import { eventBusMixin } from '../../mixins/event-bus.js';
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';
import DebtLimitFInfo from '@/components/DebLimitFInfo/DebtLimitFInfo.vue';

export default {
    name: 'DefiFMint',

    components: { DebtLimitFInfo, FPlaceholder, FTokenValue, FBackButton, FMessage, FCircleProgress },

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
            wftmToken: {},
            /** @type {DefiToken} */
            fusdToken: {},
            /** @type {DefiToken[]} */
            tokens: [],
            id: getUniqueId(),
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        debt() {
            // overall debt
            return this.$defi.fromTokenValue(this.defiAccount.debtValue, this.fusdToken);
        },

        debtFUSD() {
            /** @type {DefiTokenBalance} */
            const tokenBalance = this.$defi.getDefiAccountDebt(this.defiAccount, this.fusdToken);

            return this.$defi.fromTokenValue(tokenBalance.balance, this.fusdToken) || 0;
        },

        collateral() {
            /** @type {DefiTokenBalance} */
            const tokenBalance = this.$defi.getDefiAccountCollateral(this.defiAccount, this.wftmToken);

            return this.$defi.fromTokenValue(tokenBalance.balance, this.wftmToken) || 0;
        },

        availableFTM() {
            return this.wftmToken ? this.$defi.fromTokenValue(this.wftmToken.availableBalance, this.wftmToken) || 0 : 0;
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
            return this.wftmToken ? this.$defi.fromTokenValue(this.wftmToken.availableBalance, this.wftmToken) || 0 : 0;
        },

        maxMintable() {
            return this.debtFUSD + this.$defi.getBorrowLimit(this.defiAccount);
            /*
            return (
                this.debtFUSD +
                Math.min(
                    this.availableBalance * this.tokenPrice,
                    this.$defi.getBorrowLimit(this.defiAccount) / this.tokenPrice
                )
            );
            */
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

        wftmTokenSymbol() {
            return this.$defi.getTokenSymbol(this.wftmToken);
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
            this.wftmToken = this.tokens.find((_item) => _item.symbol === ($defi.tmpWFTM ? 'WFTM' : 'FTM'));
            this.fusdToken = this.tokens.find((_item) => _item.symbol === 'FUSD');
            this.tokenPrice = $defi.getTokenPrice(this.wftmToken);
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
