<template>
    <div class="check-password-form">
        <f-form center-form @f-form-submit="$emit('f-form-submit', $event)">
            <fieldset class="">
                <legend class="not-visible">Confirm Transaction</legend>

                <div class="form-body">
                    <f-password-field
                        v-if="showPasswordField"
                        :label="passwordLabel"
                        field-size="large"
                        autocomplete="off"
                        name="pwd"
                        :validator="checkPassword"
                        validate-on-input
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                Type a password
                            </f-message>
                        </template>
                    </f-password-field>

                    <div class="align-center form-buttons">
                        <div v-if="errorMessage">
                            <f-message type="error" with-icon>{{ errorMessage }}</f-message>
                            <br />
                        </div>

                        <a
                            href="#"
                            class="btn light large break-word"
                            style="max-width: 100%;"
                            aria-label="Go to previous form"
                            @click.prevent="onPreviousBtnClick"
                        >
                            Previous
                        </a>
                        <button type="submit" class="btn large break-word" style="max-width: 100%;">
                            {{ sendButtonLabel }}
                        </button>
                    </div>
                </div>
            </fieldset>
        </f-form>
    </div>
</template>

<script>
import FForm from '../core/FForm/FForm.vue';
import FPasswordField from '../core/FPasswordField/FPasswordField.vue';
import FMessage from '../core/FMessage/FMessage.vue';

export default {
    components: { FMessage, FPasswordField, FForm },

    props: {
        showPasswordField: {
            type: Boolean,
            default: false,
        },
        errorMessage: {
            type: String,
            default: '',
        },
        passwordLabel: {
            type: String,
            default: 'Please enter your wallet password to send the transaction',
        },
        sendButtonLabel: {
            type: String,
            default: 'Send',
        },
    },

    methods: {
        checkPassword(_value) {
            return _value && _value.length > 0;
        },

        onPreviousBtnClick() {
            this.$emit('go-back');
        },
    },
};
</script>
