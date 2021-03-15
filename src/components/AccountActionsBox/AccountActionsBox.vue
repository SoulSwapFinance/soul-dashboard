<template>
    <nav class="account-actions-box actions-box">
        <ul class="no-markers">
            <li>
                <router-link :to="{ name: 'account-history' }" class="action" title="Home">
                    <span class="btn large same-size round">
                        <icon data="@/assets/svg/wallet.svg" width="20" height="20" :fill="false" aria-hidden="true" />
                    </span>
                    <span class="link-label">Wallet</span>
                </router-link>
            </li>
            <li>
                <router-link :to="{ name: 'account-send' }" class="action" title="Send">
                    <span class="btn large same-size round">
                        <icon data="@/assets/svg/send.svg" width="20" height="20" aria-hidden="true" />
                    </span>
                    <span class="link-label">Send</span>
                </router-link>
            </li>
            <li>
                <router-link :to="{ name: 'account-receive' }" class="action" title="Receive">
                    <span class="btn large same-size round">
                        <icon data="@/assets/svg/receive.svg" width="20" height="20" aria-hidden="true" />
                    </span>
                    <span class="link-label">Receive</span>
                </router-link>
            </li>
            <!--
            <li>
                <router-link :to="{ name: 'account-stake' }" class="action" title="Stake">
                    <span class="btn large same-size round">
                        <icon data="@/assets/svg/stake.svg" width="20" height="20" aria-hidden="true" />
                    </span>
                    <span class="link-label">Staking</span>
                </router-link>
            </li>
            -->
        </ul>
    </nav>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import 'style';
</style>
