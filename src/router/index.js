import { createRouter, createWebHistory } from 'vue-router';
import ProductList from '../components/Products/ProductList.vue';
import FavoritesReport from '../components/Favorite/FavoriteReport.vue';
import ProductsReport from '../components/Report/ProductsReport.vue';

const routes = [
    {
        path: '/',
        name: 'ProductList',
        component: ProductList,
    },
    {
        path: '/favoritos',
        name: 'FavoritesReport',
        component: FavoritesReport,
    },
    {
        path: '/relatorio-produtos',
        name: 'ProductsReport',
        component: ProductsReport,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
