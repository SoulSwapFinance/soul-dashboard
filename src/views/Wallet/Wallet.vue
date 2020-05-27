<template>
    <div class="view-wallet">
        <wallet-menu use-bottom-menu />

        <div class="narrow-container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import WalletMenu from '../../components/WalletMenu/WalletMenu.vue';

export default {
    name: 'Wallet',

    components: { WalletMenu },
};
</script>

<style lang="scss">
@import 'style';
</style>
