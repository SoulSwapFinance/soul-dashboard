<template>
    <div class="view-home vertical-layout">
        <f-header/>

        <main class="main">
            <div class="narrow-container">
                <router-view></router-view>
            </div>
        </main>

        <f-footer/>
    </div>
</template>

<script>
    import FHeader from "../layouts/FHeader.vue";
    import FFooter from "../layouts/FFooter.vue";

    export default {
        components: {
            FFooter,
            FHeader
        }
    }
</script>

<style lang="scss">
    .view-home {
        position: relative;
        padding-top: $f-header-height;

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            background: $theme-color;
            width: 100%;
            height: 512px
        }

        .main {
            position: relative;
            z-index: 1;
        }
    }
</style>
