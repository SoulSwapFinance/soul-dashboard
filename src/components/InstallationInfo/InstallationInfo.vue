<template>
    <div class="installation-info">
        <p class="align-center">
            The Fantom fWallet has been created as a Progressive Web App (PWA) which is easy to launch on all platforms:
        </p>

        <div class="inst-buttons">
            <button class="btn light large" @click="showDesktopInfo">
                <icon data="@/assets/svg/brands/windows.svg" width="20" height="20" aria-hidden="true" />
                Windows
            </button>
            <button class="btn light large" @click="showDesktopInfo">
                <icon data="@/assets/svg/brands/apple.svg" width="20" height="20" aria-hidden="true" />
                macOS
            </button>
            <button class="btn light large" @click="showDesktopInfo">
                <icon data="@/assets/svg/brands/linux.svg" width="20" height="20" aria-hidden="true" />
                Linux
            </button>
            <button class="btn light large" @click="showIOSInfo">
                <icon data="@/assets/svg/brands/apple.svg" width="20" height="20" aria-hidden="true" />
                iOS
            </button>
            <button class="btn light large" @click="showAndroidInfo">
                <icon data="@/assets/svg/brands/android.svg" width="20" height="20" aria-hidden="true" />
                Android
            </button>
        </div>

        <f-window
            ref="desktopInfo"
            modal
            title="Desktop Installation"
            style="max-width: 520px;"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
        >
            <div class="inst-content">
                <ul class="no-markers">
                    <li>
                        <b>Step 1:</b> Open the <a href="https://pwawallet.fantom.network/">Fantom Wallet</a> in
                        <b>Chrome</b>
                    </li>
                    <li><b>Step 2:</b> Go to <b>Settings</b> (Three dots in the top right corner)</li>
                    <li><b>Step 3:</b> Click <b>“Install Fantom PWA Wallet”</b></li>
                </ul>
            </div>
        </f-window>

        <f-window
            ref="iosInfo"
            modal
            title="iOS Installation"
            style="max-width: 520px;"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
        >
            <div class="inst-content">
                <ul class="no-markers">
                    <li>
                        <b>Step 1:</b> Open the <a href="https://pwawallet.fantom.network/">Fantom Wallet</a> in
                        <b>Safari</b>
                    </li>
                    <li><b>Step 2:</b> Click the <b>Share button</b> in Safari (at the bottom)</li>
                    <li><b>Step 3:</b> Click <b>“Add to Home Screen”</b></li>
                </ul>
            </div>
        </f-window>

        <f-window
            ref="androidInfo"
            modal
            title="Android Installation"
            style="max-width: 520px;"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
        >
            <div class="inst-content">
                <ul class="no-markers">
                    <li>
                        <b>Step 1:</b> Open the <a href="https://pwawallet.fantom.network/">Fantom Wallet</a> in
                        <b>Chrome</b>
                    </li>
                    <li><b>Step 2:</b> Click <b>Settings</b> (top right corner)</li>
                    <li><b>Step 3:</b> Click <b>“Add to Home Screen”</b></li>
                </ul>
            </div>
        </f-window>
    </div>
</template>

<script>
import FWindow from '../core/FWindow/FWindow.vue';
export default {
    name: 'InstallationInfo',

    components: { FWindow },

    data() {
        return {
            desktopTitle: '',
        };
    },

    methods: {
        showDesktopInfo() {
            this.$refs.desktopInfo.show();
        },

        showIOSInfo() {
            this.$refs.iosInfo.show();
        },

        showAndroidInfo() {
            this.$refs.androidInfo.show();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
