<template>
    <div class="wallet-menu" :class="cssClass">
        <f-hamburger-switch
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
                    <router-link to="/">
                        <icon data="@/assets/svg/fantom.svg" width="40" height="50" />
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
    </div>
</template>

<script>
import FSimpleNavigation from '../core/FSimpleNavigation/FSimpleNavigation.vue';
import FHamburgerSwitch from '../core/FHamburgerSwitch/FHamburgerSwitch.vue';
import SocialMediaLinks from '../SocialMediaLinks/SocialMediaLinks.vue';
import { mapGetters, mapState } from 'vuex';
import { helpersMixin } from '../../mixins/helpers.js';
import dashboardIcon from '../../assets/svg/dashboard.svg';

const ACCOUNT_DEFAULT_VIEW = 'account-history';

/**
 * Main menu.
 */
export default {
    name: 'WalletMenu',

    components: { SocialMediaLinks, FHamburgerSwitch, FSimpleNavigation },

    mixins: [helpersMixin],

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
                    title: 'Dashboard',
                    icon: dashboardIcon,
                },
                {
                    url: {
                        name: ACCOUNT_DEFAULT_VIEW,
                    },
                    title: 'Wallet',
                    icon: dashboardIcon,
                    walletLink: true,
                },
                {
                    url: {
                        name: 'settings',
                    },
                    title: 'Settings',
                    icon: dashboardIcon,
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
            };
        },

        ...mapState(['breakpoints']),

        ...mapGetters(['currentAccount']),
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
            const { navigation } = this;
            const account = _account || this.currentAccount;
            let walletNavItemIdx = -1;

            navigation.find((_item, _idx) => {
                if (_item.walletLink) {
                    walletNavItemIdx = _idx;
                    return true;
                }

                return false;
            });

            if (walletNavItemIdx > -1) {
                if (account) {
                    this.$set(navigation, walletNavItemIdx, {
                        ...navigation[walletNavItemIdx],
                        url: {
                            name: ACCOUNT_DEFAULT_VIEW,
                            params: { address: account.address },
                        },
                        linkTitle: account.name || account.address,
                        disabled: false,
                    });
                } else {
                    this.$set(navigation, walletNavItemIdx, {
                        ...navigation[walletNavItemIdx],
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
