<template>
    <div class="account-actions-box">
        <ul class="no-markers">
            <li>
                <button class="btn large light same-size round" title="copy address" @click="onButtonClick">
                    <icon data="@/assets/svg/copy.svg" width="20" height="20" aria-hidden="true" />
                </button>
            </li>
            <li>
                <button class="btn large light same-size round" title="qr code of address" @click="onButtonClick">
                    <icon data="@/assets/svg/qr.svg" width="20" height="20" aria-hidden="true" />
                </button>
            </li>
            <li>
                <button class="btn large light same-size round" title="download keystore" @click="onButtonClick">
                    <icon data="@/assets/svg/download.svg" width="20" height="20" aria-hidden="true" />
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    methods: {
        onButtonClick() {
            alert('not implemented yet');
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
