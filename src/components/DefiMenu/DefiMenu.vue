<template>
    <div class="defi-menu">
        <ul class="no-markers row justify-content-center">
            <slot>
                <li class="col-4 col-6-lg">
                    <div class="menu-item">
                        <h2 class="h1">fMint</h2>
                        <div class="icon">
                            <icon data="@/assets/svg/defi/mint.svg" width="96" height="96" />
                        </div>
                        <p class="description">Mint fUSD by locking your FTM</p>
                        <router-link :to="{ name: 'defi-fmint' }" class="clickable title">
                            Mint fUSD
                        </router-link>
                    </div>
                </li>
                <li class="col-4 col-6-lg">
                    <div class="menu-item disabled" tabindex="0">
                        <h2 class="h1">fTrade</h2>
                        <div class="icon">
                            <icon data="@/assets/svg/defi/ftrade.svg" width="96" height="96" />
                        </div>
                        <p class="description">Trade synthetic assets to FTM and fUSD</p>
                        <div class="title">Coming Soon</div>
                    </div>
                </li>
                <li class="col-4 col-6-lg">
                    <div class="menu-item disabled" tabindex="0">
                        <h2 class="h1">fLend</h2>
                        <div class="icon">
                            <icon data="@/assets/svg/defi/flend.svg" width="96" height="96" />
                        </div>
                        <p class="description">Loan your tokens and borrow synths</p>
                        <div class="title">Coming Soon</div>
                    </div>
                </li>
            </slot>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'DefiMenu',
};
</script>

<style lang="scss">
@import 'style';
</style>
