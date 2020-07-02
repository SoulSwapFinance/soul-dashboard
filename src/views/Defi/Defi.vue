<template>
    <div class="view-defi">
        <template v-if="!currentAccount">
            <f-message type="error" with-icon>Bad wallet</f-message>
        </template>
        <template v-else>
            <address-info-box />
            <main class="main">
                <f-view-transition watch-route>
                    <router-view></router-view>
                </f-view-transition>
            </main>
        </template>
    </div>
</template>

<script>
import FMessage from '../../components/core/FMessage/FMessage.vue';
import AddressInfoBox from '../../components/AddressInfoBox/AddressInfoBox.vue';
import { mapGetters } from 'vuex';
import FViewTransition from '../../components/core/FViewTransition/FViewTransition.vue';

export default {
    name: 'Defi',

    components: { FViewTransition, AddressInfoBox, FMessage },

    computed: {
        ...mapGetters(['currentAccount']),
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
