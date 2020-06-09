<template>
    <div class="settings-form">
        <f-card class="f-card-double-padding">
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
                        <br />
                        <f-checkbox name="night_mode" label="Night Mode" />
                        -->

                        <p>
                            <a href="https://fantom.foundation/how-to-use-fantom-wallet/" target="_blank">
                                How to use Fantom PWA wallet
                            </a>
                        </p>
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

export default {
    name: 'SettingsForm',

    components: { FSelect, FForm, FCard },

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
            } else if (detail.eTarget.name === 'language') {
                alert('not implemented yet');
            } else if (detail.eTarget.name === 'night_mode') {
                alert('not implemented yet');
            }
        },
    },
};
</script>
