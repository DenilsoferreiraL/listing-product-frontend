<template>
    <div class="container">
        <h1>Favoritos</h1>

        <div v-if="favorites.length === 0">
            <h2>Nenhum favorito encontrado</h2>
        </div>
        <div v-else class="product-list">
            <div v-for="product in favoriteProducts" :key="product.id" class="product-card">
                <img :src="product.image" :alt="product.name" />
                <div class="star">
                    <i @click.stop="toggleFavorite(product.id)"
                        :class="isFavorited(product.id) ? 'fa fa-star filled' : 'fa fa-star'"></i>
                </div>
                <h3>{{ product.name }}</h3>
                <p>R$ {{ product.price.toFixed(2) }}</p>
            </div>
        </div>
        <button @click="goBack" class="back-button">Voltar</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            favoriteProducts: [],
            favorites: JSON.parse(localStorage.getItem('favorites')) || []
        };
    },
    methods: {
        /**
         * Fetch the list of favorite products from the API based on the user's favorites.
         * @returns {Promise<void>} A promise that resolves when the favorite products are fetched.
         * @throws {Error} If the API request fails.
         */
        async fetchFavoriteProducts() {
            if (this.favorites.length === 0) {
                return;
            }

            try {
                const response = await axios.get('http://localhost:3000/favoritos', {
                    params: { ids: this.favorites.join(',') }
                });
                this.favoriteProducts = response.data;
            } catch (error) {
                console.error("Erro ao buscar produtos favoritos:", error);
            }
        },

        /**
         * Navigate back to the previous page.
         * @returns {void}
         */
        goBack() {
            this.$router.back();
        },

        /**
         * Toggle the favorite status of a product.
         * @param {number} productId The ID of the product to toggle.
         * @returns {void}
         */
        toggleFavorite(productId) {
            if (this.isFavorited(productId)) {
                this.favorites = this.favorites.filter(id => id !== productId);
            } else {
                this.favorites.push(productId);
            }
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            this.fetchFavoriteProducts();
        },

        /**
         * Check if a product is favorited.
         * @param {number} productId The ID of the product.
         * @returns {boolean} True if the product is favorited, otherwise false.
         */
        isFavorited(productId) {
            return this.favorites.includes(productId);
        }
    },
    mounted() {
        this.fetchFavoriteProducts();
    }
};
</script>

<style>
@import './FavoriteReport.css';
</style>
