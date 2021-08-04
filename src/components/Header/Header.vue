<template>
    <header class="f-header">
        <div class="narrow-container">
            <div class="row no-collapse align-items-center">
                <div class="col">
                    <!-- <router-link to="/" class="logo" :aria-label="$t('view_home.back_to_home')">
                        <img src="soul-logo.png" alt="" class="not-fluid" />
                    </router-link> -->
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import HeaderWithNavigation from '../HeaderWithNavigation.vue';
/**
 * Renders header and takes care of navigation.
 */
export default {
    // eslint-disable-next-line vue/no-unused-components
    components: { HeaderWithNavigation },
};
</script>

<style lang="scss">
@import 'style';
</style>
