<template>
    <div class="view-eip">
        <header>
            <router-link to="/dashboard" class="btn light same-size round open-tab" target="_blank">
                <icon data="@/assets/svg/open-tab.svg" />
            </router-link>
            <div class="narrow-container">
                <div class="row no-collapse align-items-center">
                    <div class="col">
                        <router-link
                            to="/dashboard"
                            class="logo"
                            :aria-label="$t('view_home.back_to_home')"
                            target="_blank"
                        >
                            <img src="fantom-logo.svg" alt="" class="not-fluid" />
                        </router-link>
                    </div>
                </div>
            </div>
        </header>

        <router-view />
    </div>
</template>

<script>
export default {
    components: {},
};
</script>

<style lang="scss">
@import 'style';
</style>
