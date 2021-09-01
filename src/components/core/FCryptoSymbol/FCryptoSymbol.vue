<template>
    <div class="f-crypto-symbol">
        <span class="img" :style="{ width: imgWidth, height: imgHeight }">
            <icon v-if="svgIcon" :data="svgIcon" original />
            <img
                v-else-if="token.logoUrl || token.logoURL"
                :src="token.logoUrl || token.logoURL"
                class="not-fluid"
                :alt="$defi.getTokenSymbol(token)"
            />
        </span>
        <span v-if="!noSymbol">{{ $defi.getTokenSymbol(token) }}</span>
    </div>
</template>

<script>
import soulIcon from '../../../assets/svg/tokens/SOUL.svg';
import ftmIcon from '../../../assets/svg/tokens/FTM.svg';
import wftmIcon from '../../../assets/svg/tokens/wFTM.svg';
import fusdIcon from '../../../assets/svg/tokens/fUSD.svg';
import ethIcon from '../../../assets/svg/tokens/fETH.svg';
import btcIcon from '../../../assets/svg/tokens/fBTC.svg';
import linkIcon from '../../../assets/svg/tokens/fLINK.svg';
import triangleIcon from '../../../assets/svg/triangles.svg';

/**
 * Render crypto logo and name by given token.
 * Requires vue defi plugin ($defi).
 */
export default {
    name: 'FCryptoSymbol',

    props: {
        /** @type {DefiToken} */
        token: {
            type: Object,
            default() {
                return null;
            },
            required: true,
        },
        /** Hide symbol (text). */
        noSymbol: {
            type: Boolean,
            default: false,
        },
        imgWidth: {
            type: String,
            default: '40px',
        },
        imgHeight: {
            type: String,
            default: '40px',
        },
    },

    data() {
        return {
            logoUrl: this.token ? this.token.logoUrl || this.token.logoURL : '',
        };
    },

    computed: {
        svgIcon() {
            const { token } = this;

            if (token) {
                switch (token.symbol) {
                    case 'SOUL':
                        return soulIcon;
                    case 'FTM':
                        return ftmIcon;
                    case 'WFTM':
                        return wftmIcon;
                    case 'SFTM':
                        return wftmIcon;
                    case 'FUSD':
                        return fusdIcon;
                    case 'FETH':
                        return ethIcon;
                    case 'FBTC':
                        return btcIcon;
                    case 'FLINK':
                        return linkIcon;
                    case 'SOUL-LP':
                        return soulIcon;
                }
            }

            return triangleIcon;
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
