<template>
    <div class="container">
        <div class="report-container">
            <h1>Relatório de Produtos</h1>
            <div class="grid-report">
                <div class="grid-header">
                    <span>ID</span>
                    <span>Nome</span>
                    <span>Preço</span>
                    <span>Destaque</span>
                </div>
                <div v-for="product in products" :key="product.id" class="grid-row">
                    <span>{{ product.id }}</span>
                    <span>{{ product.name }}</span>
                    <span>R$ {{ product.price.toFixed(2) }}</span>
                    <span>{{ product.highlighted ? 'Sim' : 'Não' }}</span>
                </div>
            </div>
        </div>
        <button @click="goBack">Voltar</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            products: []
        };
    },
    methods: {
        /**
         * Fetch the product list from the API and update the products data property.
         * @returns {Promise<void>} A promise that resolves when the product list is fetched.
         * @throws {Error} If the API request fails.
         */
        async fetchProductList() {
            try {
                const response = await axios.get('http://localhost:3000/lista-produtos');
                this.products = response.data;
            } catch (error) {
                console.error("Erro ao buscar lista de produtos:", error);
            }
        },

        /**
         * Navigate back to the previous route.
         * @returns {void}
         */
        goBack() {
            this.$router.go(-1);
        }
    },

    mounted() {
        this.fetchProductList();
    }
};
</script>

<style>
@import './ProductsReport';
</style>
