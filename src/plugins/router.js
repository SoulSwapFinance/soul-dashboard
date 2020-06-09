import Vue from 'vue';
import VueRouter from 'vue-router';
import { routes } from '../routes.js';
import { store } from '../store';

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

router.beforeEach((_to, _from, _next) => {
    // redirect to dashboard if an account exists and we are on homepage
    if (!_from.name && _to.name === 'welcome' && store.getters.accounts.length > 0) {
        _next({ name: 'dashboard' });
    } else {
        _next();
    }
});
