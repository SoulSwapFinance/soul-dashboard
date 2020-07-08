<template>
    <div class="view-defi-fmint">
        <defi-menu>
            <li class="col-4 col-6-lg">
                <div class="menu-item disabled">
                    <h2 class="h1">Manage collateral</h2>
                    <div class="icon">
                        <icon data="@/assets/svg/defi/mint.svg" width="96" height="96" />
                    </div>
                    <p class="description">Lock FTM to use it as collateral and mint fUSD</p>
                    <div class="title">Coming Soon</div>
                </div>
            </li>
            <li class="col-4 col-6-lg">
                <div class="menu-item" tabindex="0">
                    <h2 class="h1">Mint</h2>
                    <div class="icon">
                        <icon data="@/assets/svg/defi/mint.svg" width="96" height="96" />
                    </div>
                    <p class="description">Mint fUSD by locking your FTM</p>
                    <router-link :to="{ name: 'defi-mint' }" class="clickable title">
                        Mint fUSD
                    </router-link>
                </div>
            </li>
            <li class="col-4 col-6-lg">
                <div class="menu-item disabled" tabindex="0">
                    <h2 class="h1">Repay</h2>
                    <div class="icon">
                        <icon data="@/assets/svg/defi/repay.svg" width="96" height="96" />
                    </div>
                    <p class="description">Repay the fUSD you minted and unlock your FTM</p>
                    <div class="title">Coming Soon</div>
                </div>
            </li>
        </defi-menu>
    </div>
</template>

<script>
import DefiMenu from '../../components/DefiMenu/DefiMenu.vue';

export default {
    name: 'DefiFMint',

    components: { DefiMenu },
};
</script>

<style lang="scss">
@import 'style';
</style>
