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
                            :data="currency"
                            :value="$store.state.currency"
                        />

                        <f-select
                            name="fraction_digits"
                            label="Fraction Digits"
                            select-size="large"
                            :data="fractionDigits"
                            :value="$store.state.fractionDigits.toString()"
                        />

                        <f-select name="language" label="Language" select-size="large" :data="language" value="en-US" />

                        <br />
                        <f-checkbox name="night_mode" label="Night Mode" />
                    </div>
                </fieldset>
            </f-form>
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import FForm from '../core/FForm/FForm.vue';
import FCheckbox from '../core/FCheckbox/FCheckbox.vue';
import FSelect from '../core/FSelect/FSelect.vue';

export default {
    name: 'SettingsForm',

    components: { FSelect, FCheckbox, FForm, FCard },

    data() {
        return {
            currency: [
                { value: 'USD', label: 'USD' },
                { value: 'EUR', label: 'EUR' },
            ],
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
