import Vue from 'vue';
import VueRouter from 'vue-router';
import { routes } from '../routes.js';

Vue.use(VueRouter);

/** Don't scroll page to top while navigating to these components. */
const DONT_SCROLL_TO_TOP = ['account-stake', 'account-send', 'account-receive', 'account-history'];

export const router = new VueRouter({
    routes,
    scrollBehavior(_to, _from, _savedPosition) {
        if (_savedPosition) {
            return _savedPosition;
        } else if (DONT_SCROLL_TO_TOP.indexOf(_to.name) > -1 && DONT_SCROLL_TO_TOP.indexOf(_from.name) > -1) {
            return {};
        } else {
            return { x: 0, y: 0 };
        }
    },
    // mode: 'history'
});
