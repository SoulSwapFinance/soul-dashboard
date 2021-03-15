<template>
    <div
        class="contact-list"
        :class="{ 'edit-mode': editMode }"
        @click="onContactListClick"
        @keyup="onContactListKeyup"
    >
        <ul class="no-markers">
            <li v-for="contact in cContacts" :key="contact.address">
                <f-card hover>
                    <h3 slot="title" class="title" :data-address="contact.address">
                        <span class="row no-collapse align-items-start">
                            <span class="col">
                                <span class="address-col">
                                    <account-name v-if="pickMode" :account="contact" class="value clickable" />
                                    <a v-else class="value clickable" :href="addressUrl(contact)" target="_blank">
                                        <account-name :account="contact" />
                                    </a>

                                    <button
                                        v-if="editMode"
                                        class="btn large_ light same-size round btn-edit"
                                        title="Edit Wallet"
                                        type="button"
                                    >
                                        <icon
                                            data="@/assets/svg/monochrome/Options/Edit.svg"
                                            width="16"
                                            height="16"
                                            aria-hidden="true"
                                        />
                                    </button>

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
                                </span>
                                <span class="label">
                                    {{ $fWallet.getBlockchainLabel(contact.blockchain) }}
                                </span>
                            </span>
                        </span>
                    </h3>
                </f-card>
            </li>
        </ul>

        <p v-if="editMode" class="add-contact">
            <button class="btn large" type="button" @click="onAddContactBtnClick">
                <icon data="@/assets/svg/plus.svg" width="16" height="16" aria-hidden="true" /> New Contact
            </button>
        </p>

        <contact-detail-window
            v-if="editMode"
            ref="contactDetailWindow"
            :action="contactAction"
            :contact-data="contactData"
            @contact-detail-form-data="onContactDetailFormData"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FCard from '../core/FCard/FCard.vue';
import AccountName from '../AccountName/AccountName.vue';
import FCopyButton from '../core/FCopyButton/FCopyButton.vue';
import ContactDetailWindow from '../windows/ContactDetailWindow/ContactDetailWindow.vue';
import { ADD_CONTACT, UPDATE_CONTACT } from '../../store/actions.type.js';
import { isAriaAction } from '../../utils/aria.js';
import appConfig from '../../../app.config.js';

export default {
    name: 'ContactList',

    components: { ContactDetailWindow, FCopyButton, AccountName, FCard },

    props: {
        /** Show edit icon and 'new contact' button. */
        editMode: {
            type: Boolean,
            default: false,
        },
        /** Emit 'contact-picked' event when whole contact element is clicked. */
        pickMode: {
            type: Boolean,
            default: false,
        },
        /**
         * Filter contacts by given blockchain.
         *
         * @type {WalletBlockchain}
         */
        filterByBlockchain: {
            type: String,
            default: '',
            validator: function (_value) {
                return !_value || ['fantom', 'ethereum', 'binance'].indexOf(_value) !== -1;
            },
        },
    },

    data() {
        return {
            /**
             * Type of action with contact.
             *
             * @type {WalletContactAction}
             */
            contactAction: 'new',
            /** @type {WalletContact} */
            contactData: {},
        };
    },

    computed: {
        ...mapGetters(['contacts', 'getContactAndIndexByAddress', 'getContactsByBlockchain']),

        cContacts() {
            if (this.filterByBlockchain) {
                return this.getContactsByBlockchain(this.filterByBlockchain);
            }

            return this.contacts;
        },
    },

    methods: {
        /**
         * @param {Event} _event
         */
        getContactByEvent(_event) {
            const elem = _event.target.closest('[data-address]');

            return this.getContactAndIndexByAddress(elem ? elem.getAttribute('data-address') : '');
        },

        addressUrl(_contact) {
            const { address } = _contact;
            let url = '';

            switch (_contact.blockchain) {
                case 'fantom':
                    url = `${appConfig.explorerUrl}address/${address}`;
                    break;
                case 'ethereum':
                    url = `${appConfig.ethereumExplorerUrl}address/${address}`;
                    break;
                case 'binance':
                    url = `${appConfig.binanceExplorerUrl}address/${address}`;
                    break;
            }

            return url;
        },

        /**
         * @param {Event} _event
         */
        onContactListClick(_event) {
            if (
                !this.onEditContactButtonClick(_event) &&
                !this.editMode &&
                this.pickMode &&
                !_event.target.closest('.btn')
            ) {
                const contact = this.getContactByEvent(_event);

                if (contact.contact) {
                    this.$emit('contact-picked', contact.contact.address);
                }
            }
        },

        /**
         * @param {Event} _event
         */
        onEditContactButtonClick(_event) {
            const contact = this.getContactByEvent(_event);

            if (contact.contact && _event.target.closest('.btn-edit')) {
                this.contactAction = 'edit';
                this.contactData = { ...contact.contact, order: contact.index + 1 };

                this.$refs.contactDetailWindow.show();

                return true;
            }

            return false;
        },

        onAddContactBtnClick() {
            this.contactAction = 'new';
            this.contactData = {};

            this.$refs.contactDetailWindow.show();
        },

        /**
         * Called when `ContactSettingsForm` is submited.
         *
         * @param {object} _data
         */
        onContactDetailFormData(_data) {
            if (this.contactAction === 'new') {
                this.$store.dispatch(ADD_CONTACT, _data);
            } else if (this.contactAction === 'edit') {
                this.$store.dispatch(UPDATE_CONTACT, _data);
            }
        },

        /**
         * @param {KeyboardEvent} _event
         */
        onContactListKeyup(_event) {
            if (this.pickMode && isAriaAction(_event) && !_event.target.closest('.btn')) {
                const contact = this.getContactByEvent(_event);

                if (contact.contact) {
                    this.$emit('contact-picked', contact.contact.address);
                }
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
