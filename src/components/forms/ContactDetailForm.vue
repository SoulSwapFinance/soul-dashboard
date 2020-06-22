<template>
    <div class="contact-detail-form">
        <f-form center-form @f-form-submit="onFormSubmit">
            <fieldset>
                <legend class="not-visible">Contact Detail</legend>

                <div class="form-body">
                    <f-input
                        v-if="action === 'new'"
                        type="text"
                        label="Address"
                        field-size="large"
                        name="address"
                        validate-on-input
                        :value="contact.address"
                        :validator="checkAddress"
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                This field cannot be blank
                            </f-message>
                        </template>
                    </f-input>

                    <template v-else>
                        <span class="form-label">Address</span>
                        <div class="break-word">
                            <b style="padding-right: 16px;">{{ contact.address }}</b>
                            <f-copy-button
                                :text="contact.address"
                                tooltip="Copy address to clipboard"
                                :hide-popover-after="3100"
                                class="btn large light same-size round"
                            >
                                <template #popover-text>
                                    Address copied to clipboard. <br />
                                    Warning: Use this address to receive Opera FTM only. If you are receiving FTM-ERC20
                                    you need to use a different address!
                                </template>
                            </f-copy-button>
                            <button
                                class="btn large light same-size round"
                                title="Show QR Code"
                                type="button"
                                @click.prevent="$refs.qrWindow.show()"
                            >
                                <icon data="@/assets/svg/qr.svg" width="20" height="20" aria-hidden="true" />
                            </button>
                        </div>
                        <br />
                    </template>

                    <f-input
                        :value="contactName"
                        type="text"
                        label="Name"
                        field-size="large"
                        name="name"
                        validate-on-input
                        :validator="checkName"
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                This field cannot be blank
                            </f-message>
                        </template>
                    </f-input>

                    <f-select
                        v-if="action === 'new'"
                        :data="blockchains"
                        :value="contactBlockchain"
                        select-size="large"
                        label="Blockchain"
                    />

                    <f-input
                        :value="contactOrder"
                        type="number"
                        autocomplete="off"
                        min="1"
                        :max="contacts.length.toString(10)"
                        step="1"
                        label="Order"
                        field-size="large"
                        name="order"
                        validate-on-input
                        :validator="checkOrder"
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                Value must be between 1 and {{ contacts.length }}
                            </f-message>
                        </template>
                    </f-input>

                    <div class="align-center form-buttons">
                        <a
                            v-if="action === 'edit'"
                            href="#"
                            class="btn large secondary"
                            @click.prevent="onRemoveContactBtnClick"
                        >
                            Remove Contact...
                        </a>
                        <button type="submit" class="btn large">Save</button>
                    </div>
                </div>
            </fieldset>
        </f-form>

        <!--        <remove-contact-window ref="confirmationWindow" :contact="cContact" @contact-removed="onContactRemoved" />-->

        <q-r-code-window ref="qrWindow" :address="contact.address">
            <f-message type="warning" with-icon>
                Warning: Use this address to receive Opera FTM only. If you are receiving FTM-ERC20 you need to use a
                different address!
            </f-message>
        </q-r-code-window>
    </div>
</template>

<script>
import FForm from '../core/FForm/FForm.vue';
import FInput from '../core/FInput/FInput.vue';
import { mapGetters } from 'vuex';
import FMessage from '../core/FMessage/FMessage.vue';
import { UPDATE_ACCOUNT } from '../../store/actions.type.js';
import { helpersMixin } from '../../mixins/helpers.js';
import FCopyButton from '../core/FCopyButton/FCopyButton.vue';
import QRCodeWindow from '../windows/QRCodeWindow/QRCodeWindow.vue';
import FSelect from '../core/FSelect/FSelect.vue';
// import RemoveContactWindow from '../windows/RemoveContactWindow/RemoveContactWindow.vue';

/**
 * @mixes helpersMixin
 */
export default {
    name: 'ContactDetailForm',

    components: { FSelect, QRCodeWindow, FCopyButton, FMessage, FInput, FForm },

    mixins: [helpersMixin],

    props: {
        /** Contact data */
        contactData: {
            type: Object,
            default() {
                return {
                    address: '',
                    order: -1,
                    blockchain: 'fantom',
                };
            },
            required: true,
        },
        /**
         * Type of action with contact.
         *
         * @type {('new' | 'add' | 'edit')}
         */
        action: {
            type: String,
            default: 'new',
            validator: function (_value) {
                return ['new', 'add', 'edit'].indexOf(_value) !== -1;
            },
        },
    },

    data() {
        return {
            contact: {},
            blockchains: [
                {
                    value: 'fantom',
                    label: 'Fantom',
                },
                {
                    value: 'ethereum',
                    label: 'Ethereum',
                },
                {
                    value: 'binance',
                    label: 'Binance',
                },
            ],
        };
    },

    computed: {
        ...mapGetters(['contacts', 'getContactAndIndexByAddress']),

        /**
         * @return {string}
         */
        contactName() {
            return this.contact.name || this.contact.address || `Contact ${this.contacts.length + 1}`;
        },

        /**
         * @return {string}
         */
        contactOrder() {
            let order = this.contactData.order;

            if (order === -1) {
                const { index } = this.getContactAndIndexByAddress(this.contactData.address);
                order = index + 1;
            }

            if (this.action === 'new' && order === this.contacts.length) {
                order++;
            }

            return order.toString(10);
        },

        contactBlockchain() {
            return this.contact.blockchain || this.contactData.blockchain || 'fantom';
        },

        cContact() {
            return this.contact;
        },
    },

    mounted() {
        // this.contact = this.getContactByAddress(this.contactData.address);
    },

    methods: {
        /**
         * @param {string} _value
         * @return {boolean}
         */
        checkName(_value) {
            return !!_value.trim();
        },

        /**
         * @param {string} _value
         * @return {boolean}
         */
        checkAddress(_value) {
            return !!_value.trim();
        },

        /**
         * @param {string} _value
         * @return {boolean}
         */
        checkOrder(_value) {
            let ok = false;
            const value = parseInt(_value);
            const contactsLen = this.contacts.length;
            const max = this.action === 'new' ? contactsLen + 1 : contactsLen;

            if (!isNaN(value)) {
                ok = value > 0 && value <= max;
            }

            return ok;
        },

        /**
         * @param {{detail: {data: {}}}} _event
         */
        onFormSubmit(_event) {
            const { contactData } = this;
            const { data } = _event.detail;
            const { name } = data;
            const order = parseInt(data.order);
            let changed = false;

            if (this.checkName(name) && this.checkOrder(order)) {
                const adName = this.contact.name || contactData.address;

                changed = adName !== name || parseInt(this.contactOrder) !== order;

                if (changed) {
                    this.$store.dispatch(UPDATE_ACCOUNT, { address: contactData.address, name, order });
                }

                this.$emit('contact-detail-form-data', { name, order, changed });
            }
        },

        onRemoveContactBtnClick() {
            this.$refs.confirmationWindow.show();
        },

        onContactRemoved() {
            const parentWindow = this.findParentByName('f-window');

            if (parentWindow) {
                parentWindow.hide();
            }
        },
    },
};
</script>
