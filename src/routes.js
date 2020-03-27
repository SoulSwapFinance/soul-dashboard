import Home from './views/Home.vue';
import NotFound from "./views/NotFound.vue";

export const routes = [
    {
        name: 'home',
        path: '/',
        component: Home
    },
/*
    {
        name: 'data-table-playground',
        path: '/data-table-playground',
        component: DataTablePlayground
    },
*/
    {
        name: 'not-found',
        path: '*',
        component: NotFound
    }
];
