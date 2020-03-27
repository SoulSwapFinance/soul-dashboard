<template>
    <div id="app">
        <f-header></f-header>
        <main>
<!--            <router-view :key="$route.path"></router-view>-->
            <router-view></router-view>
        </main>
        <f-footer></f-footer>

        <f-breakpoints>
            <f-breakpoint value="768px" code="menu-mobile"></f-breakpoint>
        </f-breakpoints>
    </div>
</template>

<script>
    import FBreakpoint from "./components/FBreakpoint.vue";
    import FBreakpoints from "./components/FBreakpoints.vue";
    import FHeader from "./layouts/FHeader.vue";
    import FFooter from "./layouts/FFooter.vue";

    export default {
        name: 'App',

        components: {
            FBreakpoint,
            FBreakpoints,
            FHeader,
            FFooter
        }
    }
</script>

<style lang="scss">
    @import "./assets/scss/main";

    #app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        padding-top: $f-header-height;

        main {
            flex: 1 1;
            min-height: 700px;
        }
    }

    .narrow-container {
        padding-top: 16px;
        padding-bottom: 16px;
    }
</style>
