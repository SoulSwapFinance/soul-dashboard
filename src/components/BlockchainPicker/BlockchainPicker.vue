<template>
    <div class="blockchain-picker">
        <f-card class="f-card-double-padding">
            <h2>
                Send Opera FTM <span class="f-steps"><b>1</b> / 3</span>
            </h2>

            <h3 class="align-center h2">What blockchain will you send FTM to?</h3>

            <div class="bc-picker">
                <f-form ref="form" center-form @f-form-submit="onFormSubmit">
                    <ul class="no-markers">
                        <li>
                            <label for="bc-opera">
                                <input
                                    id="bc-opera"
                                    type="radio"
                                    name="direction"
                                    value="OperaToOpera"
                                    class="not-visible"
                                    checked
                                />
                                <span>
                                    <icon
                                        data="@/assets/svg/chain-logos/fantom-active.svg"
                                        width="64"
                                        height="64"
                                        original
                                        aria-hidden="true"
                                        class="logo-active"
                                    />
                                    <icon
                                        data="@/assets/svg/chain-logos/fantom-inactive.svg"
                                        width="64"
                                        height="64"
                                        original
                                        aria-hidden="true"
                                        class="logo-inactive"
                                    />
                                    Fantom Opera
                                </span>
                            </label>
                        </li>
                        <li>
                            <label for="bc-binance">
                                <input
                                    id="bc-binance"
                                    type="radio"
                                    name="direction"
                                    value="OperaToBinance"
                                    class="not-visible"
                                />
                                <span>
                                    <icon
                                        data="@/assets/svg/chain-logos/binance-active.svg"
                                        width="64"
                                        height="64"
                                        original
                                        aria-hidden="true"
                                        class="logo-active"
                                    />
                                    <icon
                                        data="@/assets/svg/chain-logos/binance-inactive.svg"
                                        width="64"
                                        height="64"
                                        original
                                        aria-hidden="true"
                                        class="logo-inactive"
                                    />
                                    Binance
                                </span>
                            </label>
                        </li>
                        <li>
                            <label for="bc-eth">
                                <input
                                    id="bc-eth"
                                    type="radio"
                                    name="direction"
                                    value="OperaToEthereum"
                                    class="not-visible"
                                />
                                <span>
                                    <icon
                                        data="@/assets/svg/chain-logos/ethereum-active.svg"
                                        width="64"
                                        height="64"
                                        original
                                        aria-hidden="true"
                                        class="logo-active"
                                    />
                                    <icon
                                        data="@/assets/svg/chain-logos/ethereum-inactive.svg"
                                        width="64"
                                        height="64"
                                        original
                                        aria-hidden="true"
                                        class="logo-inactive"
                                    />
                                    Ethereum
                                </span>
                            </label>
                        </li>
                    </ul>

                    <div class="align-center form-buttons">
                        <button type="submit" class="btn large break-word" style="max-width: 100%;">
                            Continue
                        </button>
                    </div>
                </f-form>
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import FForm from '../core/FForm/FForm.vue';
import { SET_SEND_DIRECTION } from '../../store/mutations.type.js';

export default {
    name: 'BlockchainPicker',

    components: { FForm, FCard },

    methods: {
        onFormSubmit(_event) {
            const { data } = _event.detail;

            if (data.direction) {
                this.$store.commit(SET_SEND_DIRECTION, data.direction);

                this.$emit('change-component', {
                    from: 'blockchain-picker',
                    to: 'send-transaction-form',
                });
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
