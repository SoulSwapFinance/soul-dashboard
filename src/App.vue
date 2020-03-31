<template>
    <div id="app">
        <!--            <router-view :key="$route.path"></router-view>-->
        <router-view></router-view>
<!--
        <f-header></f-header>
        <main>
            <router-view></router-view>
        </main>
        <f-footer></f-footer>
-->

        <f-breakpoints>
            <f-breakpoint value="768px" code="menu-mobile"></f-breakpoint>
        </f-breakpoints>
    </div>
</template>

<script>
    import FBreakpoint from "./components/FBreakpoint.vue";
    import FBreakpoints from "./components/FBreakpoints.vue";

    export default {
        name: 'App',

        components: {
            FBreakpoint,
            FBreakpoints
        }
    }
</script>

<style lang="scss">
    @import "./assets/scss/main";

    .narrow-container {
        padding-top: 16px;
        padding-bottom: 16px;
    }
</style>
