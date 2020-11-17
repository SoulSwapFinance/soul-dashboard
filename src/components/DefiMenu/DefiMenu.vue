<template>
    <div class="defi-menu">
        <ul class="no-markers row justify-content-center">
            <slot>
                <li class="col-4 col-6-lg">
                    <div class="menu-item">
                        <h2>fMint</h2>
                        <div class="icon">
                            <icon
                                data="@/assets/svg/defi/mint.svg"
                                width="96"
                                height="96"
                                original
                                class="icon-fill-color"
                            />
                        </div>
                        <p class="description">Mint fUSD by locking your FTM</p>
                        <router-link :to="{ name: 'defi-fmint' }" class="clickable title">
                            Mint fUSD
                        </router-link>
                    </div>
                </li>
                <li class="col-4 col-6-lg">
                    <div class="menu-item" tabindex="0">
                        <h2>fSwap</h2>
                        <div class="icon">
                            <icon
                                data="@/assets/svg/defi/ftrade.svg"
                                width="96"
                                height="96"
                                original
                                class="icon-stroke-color"
                            />
                        </div>
                        <p class="description">Trade synthetic assets to FTM and fUSD</p>
                        <div class="title">
                            <router-link :to="{ name: 'defi-ftrade' }" class="clickable title">
                                Start Trading
                            </router-link>
                        </div>
                    </div>
                    <!--
                    <div class="menu-item disabled" tabindex="0">
                        <h2>fTrade</h2>
                        <div class="icon">
                            <icon data="@/assets/svg/defi/ftrade.svg" width="96" height="96" original />
                        </div>
                        <p class="description">Trade synthetic assets to FTM and fUSD</p>
                        <div class="title">Coming Soon</div>
                    </div>
                    -->
                </li>
                <li class="col-4 col-6-lg">
                    <div class="menu-item" :class="{ disabled: fLendDisabled }" tabindex="0">
                        <h2>fLend</h2>
                        <div class="icon">
                            <icon data="@/assets/svg/defi/flend.svg" width="96" height="96" original />
                        </div>
                        <p class="description">Loan your tokens and borrow synths</p>
                        <div class="title">
                            <template v-if="fLendDisabled">Coming Soon</template>
                            <router-link v-else :to="{ name: 'defi-flend' }" class="clickable title">
                                Access DeFi
                            </router-link>
                        </div>
                    </div>
                </li>
            </slot>
        </ul>
    </div>
</template>

<script>
import appConfig from '../../../app.config.js';

export default {
    name: 'DefiMenu',

    computed: {
        fLendDisabled() {
            return this.$defi && appConfig.disableFLend;
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
