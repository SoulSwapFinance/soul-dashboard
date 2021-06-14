<template>
    <div class="wallet-menu" :class="cssClass">
        <f-hamburger-switch
            v-if="!useBottomMenu"
            thickness="2"
            two-lines
            @hamburger-switch-on="onHamburgerSwitchOn"
            @hamburger-switch-off="onHamburgerSwitchOff"
        ></f-hamburger-switch>

        <div class="f-drawer" @click="onDrawerClick">
            <div class="header">
                <div class="header-logo">
                    <router-link to="/">
                        <img src="fantom-logo.svg" alt="" class="not-fluid" />
                    </router-link>
                </div>
            </div>
            <div class="body">
                <div class="logo">
                    <router-link to="/" class="logo-link">
                        <icon data="@/assets/svg/fantom.svg" width="40" height="50" />
                        <span class="wallet-label">fWallet</span>
                    </router-link>
                </div>
                <f-simple-navigation :items="navigation" />
            </div>
            <div class="footer">
                <social-media-links />
                <div class="copyright">
                    <a href="https://fantom.foundation/" target="_blank" rel="nofollow">©2020 Fantom Foundation</a>
                </div>
            </div>
        </div>

        <div v-if="useBottomMenu" class="bottom-menu">
            <f-simple-navigation :items="navigation" icon-size="26" />
        </div>
    </div>
</template>

<script>
import FSimpleNavigation from '../core/FSimpleNavigation/FSimpleNavigation.vue';
import FHamburgerSwitch from '../core/FHamburgerSwitch/FHamburgerSwitch.vue';
import SocialMediaLinks from '../SocialMediaLinks/SocialMediaLinks.vue';
import { mapGetters, mapState } from 'vuex';
import { helpersMixin } from '../../mixins/helpers.js';
import homeIcon from '../../assets/svg/monochrome/Sidebar/Home.svg';
import settingsIcon from '../../assets/svg/monochrome/Sidebar/Settings.svg';
import walletIcon from '../../assets/svg/monochrome/Sidebar/Wallet.svg';
// import defiIcon from '../../assets/svg/monochrome/Sidebar/DeFi.svg';
import stakingIcon from '../../assets/svg/monochrome/Sidebar/Staking.svg';
import funiIcon from '../../assets/svg/monochrome/Sidebar/fUNI.svg';
import swapIcon from '../../assets/svg/defi/ftrade.svg';
import voteIcon from '../../assets/svg/monochrome/Sidebar/Governance.svg';
import fmintIcon from '../../assets/svg/defi/mint.svg';

/*
import homeIcon from '../../assets/svg/home.svg';
import settingsIcon from '../../assets/svg/settings.svg';
import walletIcon from '../../assets/svg/wallet.svg';
import defiIcon from '../../assets/svg/defi.svg';
import stakingIcon from '../../assets/svg/stake.svg';
import swapIcon from '../../assets/svg/defi/ftrade.svg';
import voteIcon from '../../assets/svg/thumb.svg';
*/

const ACCOUNT_DEFAULT_VIEW = 'account-history';

/**
 * Main menu.
 */
export default {
    name: 'WalletMenu',

    components: { SocialMediaLinks, FHamburgerSwitch, FSimpleNavigation },

    mixins: [helpersMixin],

    props: {
        /** Use bottom menu on small screens */
        useBottomMenu: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            /** Is drawer visible? */
            drawerOn: false,
            /** Animate drawer. */
            menuTransitionOn: false,
            /** Navigation items. */
            navigation: [
                {
                    url: {
                        name: 'dashboard',
                    },
                    title: 'Home',
                    icon: homeIcon,
                    fill: true,
                },
                {
                    url: {
                        name: ACCOUNT_DEFAULT_VIEW,
                    },
                    title: 'Wallet',
                    icon: walletIcon,
                    walletLink: true,
                    fill: true,
                },
                {
                    url: {
                        name: 'staking',
                    },
                    title: 'Staking',
                    icon: stakingIcon,
                    stakingLink: true,
                    fill: true,
                },
                {
                    url: {
                        name: 'fmint',
                    },
                    title: 'fMint',
                    icon: fmintIcon,
                    fillColor: true,
                    fmintLink: true,
                },
                {
                    url: {
                        name: 'fswap',
                    },
                    title: 'fSwap',
                    icon: swapIcon,
                    fill: true,
                    fswapLink: true,
                },
                /*{
                    url: {
                        name: 'defi',
                    },
                    title: 'DeFi',
                    icon: defiIcon,
                    deFiLink: true,
                    fill: true,
                },*/
                {
                    url: {
                        name: 'funiswap',
                    },
                    title: 'fUNI',
                    icon: funiIcon,
                    fill: true,
                    fUniswapLink: true,
                },
                {
                    url: {
                        name: 'gov',
                    },
                    title: 'Governance',
                    icon: voteIcon,
                    govLink: true,
                    fill: true,
                },
                {
                    url: {
                        name: 'settings',
                    },
                    title: 'Settings',
                    icon: settingsIcon,
                    // original: true,
                    fill: true,
                },
            ],
        };
    },

    computed: {
        /**
         * Container's css classes.
         *
         * @retun {object}
         */
        cssClass() {
            return {
                'drawer-on': this.drawerOn,
                'animate-menu': this.menuTransitionOn,
                'bottom-menu-on': this.useBottomMenu,
            };
        },

        ...mapState(['breakpoints']),

        ...mapGetters(['currentAccount', 'accounts']),
    },

    watch: {
        /**
         * Watches for vue route change.
         */
        $route() {
            this.hamburgerSwitchOff();
        },

        currentAccount(_account) {
            this.setWalletUrl(_account);
        },

        /**
         * Watches for `breakpoints` state change.
         *
         * @param {object} _breakpoints
         */
        breakpoints(_breakpoints) {
            this.onMenuBreakpoint(_breakpoints);
            /*
            const menuMobileBreakpoint = _breakpoints['menu-mobile'];

            if (menuMobileBreakpoint) {
                if (!menuMobileBreakpoint.matches) {
                    this.hamburgerSwitchOff();
                    this.menuTransitionOn = false;
                } else {
                    setTimeout(() => {
                        this.menuTransitionOn = true;
                    }, 20);
                }
            }
*/
        },
    },

    mounted() {
        this.setWalletUrl();
        this.onMenuBreakpoint(this.breakpoints);
    },

    methods: {
        hamburgerSwitchOff() {
            const fHamburgerSwitch = this.findChildByName('f-hamburger-switch');

            if (fHamburgerSwitch) {
                fHamburgerSwitch.dOn = false;
            }
        },

        onMenuBreakpoint(_breakpoints) {
            const menuMobileBreakpoint = _breakpoints['menu-mobile'];

            if (menuMobileBreakpoint) {
                if (!menuMobileBreakpoint.matches) {
                    this.hamburgerSwitchOff();
                    this.menuTransitionOn = false;
                } else {
                    setTimeout(() => {
                        this.menuTransitionOn = true;
                    }, 20);
                }
            }
        },

        /**
         * @param {object} _account
         */
        setWalletUrl(_account) {
            this.setMenuItemUrl('walletLink', _account);
            this.setMenuItemUrl('stakingLink', _account, 'staking');
            // this.setMenuItemUrl('deFiLink', _account, 'defi-home');
            this.setMenuItemUrl('fmintLink', _account, 'defi-fmint');
            this.setMenuItemUrl('fswapLink', _account, 'defi-ftrade');
            this.setMenuItemUrl('fUniswapLink', _account, 'funiswap-swap');
            this.setMenuItemUrl('govLink', _account, 'gov-home');
        },

        /**
         * @param {string} _propName
         * @param {object} [_account]
         * @param {string} [_routeName]
         */
        setMenuItemUrl(_propName, _account, _routeName = ACCOUNT_DEFAULT_VIEW) {
            const { navigation } = this;
            const account = _account || this.currentAccount;
            let navItemIdx = -1;

            navigation.find((_item, _idx) => {
                if (_item[_propName]) {
                    navItemIdx = _idx;
                    return true;
                }

                return false;
            });

            if (navItemIdx > -1) {
                if (account) {
                    this.$set(navigation, navItemIdx, {
                        ...navigation[navItemIdx],
                        url: {
                            name: _routeName,
                            params: { address: account.address },
                        },
                        linkTitle: account.name || account.address,
                        disabled: false,
                    });
                } else {
                    this.$set(navigation, navItemIdx, {
                        ...navigation[navItemIdx],
                        url: { path: '#' },
                        linkTitle: '',
                        disabled: true,
                    });
                }
            }
        },

        onHamburgerSwitchOn() {
            this.drawerOn = true;
        },

        onHamburgerSwitchOff() {
            this.drawerOn = false;
        },

        onDrawerClick() {
            this.hamburgerSwitchOff();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
