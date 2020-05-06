<template>
    <nav class="account-actions-box">
        <ul class="no-markers">
            <li>
                <router-link :to="{ name: 'account-send' }" title="Send">
                    <span class="btn large same-size round">
                        <icon data="@/assets/svg/send.svg" width="20" height="20" aria-hidden="true" />
                    </span>
                    <span class="link-label">Send</span>
                </router-link>
            </li>
            <li>
                <router-link :to="{ name: 'account-recieve' }" title="Recieve">
                    <span class="btn large same-size round">
                        <icon data="@/assets/svg/recieve.svg" width="20" height="20" aria-hidden="true" />
                    </span>
                    <span class="link-label">Recieve</span>
                </router-link>
            </li>
            <li>
                <router-link :to="{ name: 'account-stake' }" title="Stake">
                    <span class="btn large same-size round">
                        <icon data="@/assets/svg/stake.svg" width="20" height="20" aria-hidden="true" />
                    </span>
                    <span class="link-label">Staking</span>
                </router-link>
            </li>
            <li>
                <router-link :to="{ name: 'account-history' }" title="Home">
                    <span class="btn large same-size round">
                        <icon data="@/assets/svg/dashboard.svg" width="20" height="20" aria-hidden="true" />
                    </span>
                    <span class="link-label">History</span>
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import 'style';
</style>
