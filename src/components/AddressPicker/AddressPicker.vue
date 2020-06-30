<template>
    <div class="address-picker">
        <h2>Wallets</h2>
        <account-list pick-mode @account-picked="onAddressPicked" />
        <h2>Contacts</h2>
        <contact-list pick-mode @contact-picked="onAddressPicked" />
    </div>
</template>

<script>
import AccountList from '../AccountList/AccountList.vue';
import ContactList from '../ContactList/ContactList.vue';

export default {
    name: 'AddressPicker',

    components: { ContactList, AccountList },

    methods: {
        onAddressPicked(_address) {
            this.$emit('address-picked', _address);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
