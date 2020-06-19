<template>
    <div class="contact-list" :class="{ 'edit-mode': editMode }" @click="onContactListClick">
        <ul class="no-markers">
            <li v-for="(contact, index) in contacts" :key="contact.address">
                <f-card>
                    <h3 slot="title" class="title">
                        <span class="row no-collapse align-items-start">
                            <span class="col">
                                <span class="address-col">
                                    <account-name :account="contact" />

                                    <f-copy-button
                                        :text="contact.address"
                                        tooltip="Copy address to clipboard"
                                        :default-icon-size="16"
                                        class="btn light same-size round"
                                    >
                                        <template #popover-text>
                                            Address copied to clipboard.
                                            <template v-if="contact.blockchain === 'fantom'">
                                                <br />
                                                Warning: Use this address to receive Opera FTM only. If you are
                                                receiving FTM-ERC20 you need to use a different address!
                                            </template>
                                        </template>
                                    </f-copy-button>

                                    <button
                                        v-if="editMode"
                                        class="btn large_ light same-size round btn-edit"
                                        title="Edit Wallet"
                                        type="button"
                                        :data-address="contact.address"
                                        :data-index="index"
                                    >
                                        <icon data="@/assets/svg/pen.svg" width="16" height="16" aria-hidden="true" />
                                    </button>
                                </span>
                            </span>
                        </span>
                    </h3>
                </f-card>
            </li>
        </ul>

        <p v-if="editMode" class="add-contact">
            <button class="btn large" type="button" @click="onAddContactBtnClick">
                <icon data="@/assets/svg/plus.svg" width="16" height="16" aria-hidden="true" /> Add Contact
            </button>
        </p>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FCard from '../core/FCard/FCard.vue';
import AccountName from '../AccountName/AccountName.vue';
import FCopyButton from '../core/FCopyButton/FCopyButton.vue';

export default {
    name: 'ContactList',
    components: { FCopyButton, AccountName, FCard },
    props: {
        /** Show edit icon. */
        editMode: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        ...mapGetters(['contacts__']),

        // TMP!
        contacts() {
            return [
                {
                    address: '0xA2176B5eae87708Da2bc0cCb034833D3da3f1E78',
                    name: 'Contact 1',
                    blockchain: 'fantom',
                },
                {
                    address: '0xA2176B5eae87708Da2bc0cCb034833D3da3f1E78',
                    name: 'Contact 2',
                    blockchain: 'binance',
                },
            ];
        },
    },

    methods: {
        /**
         * @param {Event} _event
         */
        onContactListClick(_event) {
            if (!this.onEditContactButtonClick(_event)) {
                const elem = _event.target.closest('[data-address]');
                const address = elem ? elem.getAttribute('data-address') : '';

                if (address && address.toLowerCase() === this.currentContact.address.toLowerCase()) {
                    this.$emit('contact-picked', address);
                }
            }
        },
        /**
         * @param {Event} _event
         */
        onEditContactButtonClick(_event) {
            const elem = _event.target.closest('[data-address]');
            const address = elem ? elem.getAttribute('data-address') : '';
            const index = elem ? parseInt(elem.getAttribute('data-index')) : -1;

            if (address && !isNaN(index) && index > -1) {
                this.accountData = { address, order: index + 1 };
                this.$refs.accountSettingsWindow.show();

                return true;
            }

            return false;
        },

        onAddContactBtnClick() {
            alert('not implemented yet');
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
