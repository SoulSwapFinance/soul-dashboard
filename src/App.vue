<template>
    <div id="app">
        <!--            <router-view :key="$route.path"></router-view>-->

        <!--        <router-view aria-live="polite"></router-view>-->
        <router-view></router-view>

        <!--
        <f-header></f-header>
        <main>
            <router-view></router-view>
        </main>
        <f-footer></f-footer>
-->

        <f-breakpoints @f-breakpoint-change="onFBreakpointChange">
            <f-breakpoint value="600px" code="data-table-mobile-view"></f-breakpoint>
            <f-breakpoint value="768px" code="menu-mobile"></f-breakpoint>
        </f-breakpoints>
        <f-aria-alert></f-aria-alert>
    </div>
</template>

<script>
import FBreakpoint from './components/core/FBreakpoints/FBreakpoint.vue';
import FBreakpoints from './components/core/FBreakpoints/FBreakpoints.vue';
import { SET_BREAKPOINT, SET_TOKEN_PRICE } from './store/mutations.type.js';
import FAriaAlert from './components/core/FAriaAlert/FAriaAlert.vue';
import gql from 'graphql-tag';

export default {
    name: 'App',

    components: {
        FAriaAlert,
        FBreakpoint,
        FBreakpoints,
    },

    apollo: {
        price: {
            query: gql`
                query Price($to: String!) {
                    price(to: $to) {
                        price
                    }
                }
            `,

            result(_data) {
                if (!_data.data.price) {
                    return;
                }

                let tokenPrice = parseFloat(_data.data.price.price);

                tokenPrice = parseInt(tokenPrice * 100000) / 100000;

                this.$store.commit(SET_TOKEN_PRICE, tokenPrice);
            },

            variables() {
                return {
                    to: 'USD',
                };
            },
        },
    },

    methods: {
        onFBreakpointChange(_event) {
            this.$store.commit(SET_BREAKPOINT, _event.detail);
        },
    },
};
</script>

<style lang="scss">
@import './assets/scss/main';

.narrow-container {
    padding-top: 16px;
    padding-bottom: 16px;
}
</style>
