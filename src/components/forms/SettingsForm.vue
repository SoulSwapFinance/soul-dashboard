<template>
    <div class="settings-form">
        <f-card class="f-card-double-padding">
            <f-message type="warning" style="max-width: 600px;">
                <h2>Claim your rewards!</h2>
                <p>To participate in Fluid Staking, please claim your outstanding rewards.</p>
                <p>
                    Please note that the wallet is still under mainteinance and some data regarding staking and totals
                    might not be accurate for the duration of the mainteinance.
                </p>
                <p>We apologize for any inconvenience!</p>
                <p>
                    Even if your pending rewards balance shows 0, go ahead and claim anyway and you’ll receive the
                    correct amount.
                </p>
            </f-message>
            <br /><br />

            <f-form ref="form" center-form @f-form-change="onFormChange">
                <fieldset>
                    <legend class="not-visible">Settings form</legend>
                    <div class="form-body">
                        <f-select
                            name="currency"
                            label="Currency"
                            select-size="large"
                            :data="currencies"
                            :value="$store.state.currency"
                        />

                        <f-select
                            name="fraction_digits"
                            label="Decimal Points"
                            select-size="large"
                            :data="fractionDigits"
                            :value="$store.state.fractionDigits.toString()"
                        />

                        <f-select name="language" label="Language" select-size="large" :data="language" value="en-US" />

                        <!--
                        <f-input
                            name="defi_slippage_reserve"
                            :value="$store.state.defiSlippageReserve.toString()"
                            label="DeFi Slippage Reserve"
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            field-size="large"
                            validate-on-input
                            :validator="checkDefiSlippageReserve"
                        >
                            <template #bottom="sProps">
                                <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                    Value must be between 0% and 100%
                                </f-message>
                            </template>
                        </f-input>
                        -->

                        <br />
                        <f-checkbox name="night_mode" label="Night Mode" :checked="$store.state.nightMode" />

                        <p style="padding: 24px 0 32px 0;">
                            <a href="https://fantom.foundation/how-to-use-fantom-wallet/" target="_blank">
                                How to use Fantom PWA wallet
                            </a>
                        </p>

                        <p style="padding: 0 0 32px 0;">
                            <a href="https://explorer.fantom.network/" target="_blank">
                                Fantom Explorer
                            </a>
                        </p>

                        <social-media-links />
                    </div>
                </fieldset>
            </f-form>
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import FForm from '../core/FForm/FForm.vue';
import FSelect from '../core/FSelect/FSelect.vue';
import appConfig from '../../../app.config.js';
import SocialMediaLinks from '../SocialMediaLinks/SocialMediaLinks.vue';
import FMessage from '@/components/core/FMessage/FMessage.vue';
import FCheckbox from '@/components/core/FCheckbox/FCheckbox.vue';

export default {
    name: 'SettingsForm',

    components: { FCheckbox, FMessage, SocialMediaLinks, FSelect, FForm, FCard },

    data() {
        return {
            language: [{ value: 'en-US', label: 'English' }],
            fractionDigits: [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
                { value: '6', label: '6' },
            ],
        };
    },

    computed: {
        /**
         * Data for currency select.
         *
         * @return {[]}
         */
        currencies() {
            const selectData = [];
            const { currencies } = appConfig.settings;

            currencies.forEach((_currency) => {
                selectData.push({
                    value: _currency,
                    label: _currency,
                });
            });

            return selectData;
        },
    },

    methods: {
        /**
         * @param {string} _value
         * @return {boolean}
         */
        checkDefiSlippageReserve(_value) {
            let ok = false;
            const value = parseFloat(_value);

            if (!isNaN(value)) {
                ok = value >= 0 && value <= 100;
            }

            return ok;
        },

        onFormChange(_event) {
            const { detail } = _event;
            const appNode = this.$root.$children[0];

            if (detail.eTarget.name === 'currency') {
                if (appNode) {
                    appNode.setCurrency(detail.value);
                }
            } else if (detail.eTarget.name === 'fraction_digits') {
                if (appNode) {
                    appNode.setFractionDigits(parseInt(detail.value));
                }
                /*
            } else if (detail.eTarget.name === 'defi_slippage_reserve') {
                if (appNode && this.checkDefiSlippageReserve(detail.value)) {
                    appNode.setDefiSlippageReserve(parseFloat(detail.value));
                }
                */
            } else if (detail.eTarget.name === 'language') {
                alert('not implemented yet');
            } else if (detail.eTarget.name === 'night_mode') {
                appNode.setNightMode(detail.value === 'on');
            }
        },
    },
};
</script>
