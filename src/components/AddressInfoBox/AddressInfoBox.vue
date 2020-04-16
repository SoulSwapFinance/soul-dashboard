<template>
    <div class="address-info-box">
        <div class="row align-items-center">
            <div class="col-9 align-center-sm">
                <router-link to="/" class="router-link">
                    <strong class="address break-word">
                        {{ cMobileView ? formatHash(currentAccountAddress) : currentAccountAddress }}
                    </strong>
                </router-link>
            </div>
            <div class="col align-right align-center-sm">
                <address-actions-box />
            </div>
        </div>
    </div>
</template>

<script>
import AddressActionsBox from '../AddressActionsBox/AddressActionsBox.vue';
import { mapGetters } from 'vuex';
import { formatHash } from '../../filters.js';

export default {
    components: { AddressActionsBox },

    computed: {
        ...mapGetters(['currentAccountAddress']),

        /**
         * Property is set to `true`, if 'menu-mobile' breakpoint is reached.
         *
         * @return {Boolean}
         */
        cMobileView() {
            const menuBreakpoint = this.$store.state.breakpoints['menu-mobile'];

            return menuBreakpoint && menuBreakpoint.matches;
        },
    },

    methods: {
        formatHash,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
