<template>
    <header class="f-header">
        <div class="narrow-container">
            <div class="row no-collapse align-items-center">
                <div class="col">
                    <router-link to="/" class="logo" :aria-label="$t('view_home.back_to_home')">
                        <img src="fantom-logo.svg" alt="" class="not-fluid" />
                    </router-link>
                </div>
                <div class="open-tab">
                    <a :aria-label="$t('view_home.back_to_home')" @click="openTab">
                        Open in tab
                    </a>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
/**
 * Renderes header and takes care of navigation.
 */
/* global chrome */
export default {
    components: {},

    methods: {
        openTab: function () {
            chrome.tabs.create({
                url: window.location.href,
                active: true,
            });
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
