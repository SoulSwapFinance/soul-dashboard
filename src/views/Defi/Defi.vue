<template>
    <div class="view-defi">
        <template v-if="!currentAccount">
            <f-message type="error" with-icon>Bad wallet</f-message>
        </template>
        <template v-else>
            <address-info-box />
            <main class="main">
                <router-view></router-view>
            </main>
        </template>
    </div>
</template>

<script>
import FMessage from '../../components/core/FMessage/FMessage.vue';
import AddressInfoBox from '../../components/AddressInfoBox/AddressInfoBox.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'Defi',

    components: { AddressInfoBox, FMessage },

    computed: {
        ...mapGetters(['currentAccount']),
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
