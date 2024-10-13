<template>
  <div class="container">
    <div class="box-top">
      <h1>Produtos</h1>
      <div class="box-button">
        <button @click="goToFavoritesReport">Favoritos</button>
        <button @click="goToProductsReport">Relatório</button>
      </div>
      <div class="search">
        <input type="text" placeholder="Buscar produto" v-model="searchQuery" @input="trackSearch" />
      </div>
    </div>
    <div class="product-list">
      <h2 v-if="filteredProducts.length === 0">Nenhum produto encontrado</h2>
      <div v-for="product in filteredProducts" :key="product.id" class="product-card"
        @click="trackProductClick(product)">
        <img :src="product.image" :alt="product.name" />
        <div class="star">
          <i @click.stop="toggleFavorite(product.id)"
            :class="isFavorited(product.id) ? 'fa fa-star filled' : 'fa fa-star'"></i>
        </div>
        <h3>{{ product.name }}</h3>
        <p>R$ {{ product.price.toFixed(2) }}</p>

        <button @click.stop="toggleIngredients(product.id)">Mostrar Detalhes</button>

        <div v-if="product.showIngredients" class="ingredient-mask">
          <button class="close-button" @click.stop="toggleIngredients(product.id)">X</button>
          <ul>
            <li v-for="ingredient in product.ingredients" :key="ingredient">{{ ingredient }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import './ProductList.css';
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  data() {
    return {
      products: [],
      searchQuery: '',
      favorites: JSON.parse(localStorage.getItem('favorites')) || []
    };
  },
  computed: {
    /**
     * Filter the list of products based on the search query.
     * @returns {Array} An array of products that match the search query.
     */
    filteredProducts() {
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    /**
     * Fetch the list of products from the API and update the products data property.
     * @returns {Promise<void>} A promise that resolves when the products are fetched.
     * @throws {Error} If the API request fails.
     */
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:3000/produtos');
        this.products = response.data.map(product => ({
          ...product,
          showIngredients: false
        }));

        window.dataLayer.push({
          event: 'productsListing',
          productsListing: response.data,
        });

      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    },

    /**
     * Track the product click event for analytics.
     * @param {Object} product The clicked product.
     * @returns {void}
     */
    trackProductClick(product) {
      window.dataLayer.push({
        event: 'productClick',
        productName: product.name,
        productId: product.id
      });
    },

    /**
     * Track the search event for analytics.
     * @returns {void}
     */
    trackSearch() {
      window.dataLayer.push({
        event: 'searchProduct',
        searchQuery: this.searchQuery
      });
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
    },

    /**
     * Check if a product is favorited.
     * @param {number} productId The ID of the product.
     * @returns {boolean} True if the product is favorited, otherwise false.
     */
    isFavorited(productId) {
      return this.favorites.includes(productId);
    },

    /**
     * Toggle the visibility of product ingredients.
     * @param {number} productId The ID of the product to toggle ingredients for.
     * @returns {void}
     */
    toggleIngredients(productId) {
      const product = this.products.find(p => p.id === productId);
      product.showIngredients = !product.showIngredients;
    },

    /**
     * Navigate to the favorites report page.
     * @returns {void}
     */
    goToFavoritesReport() {
      this.$router.push('/favoritos');
    },

    /**
     * Navigate to the products report page.
     * @returns {void}
     */
    goToProductsReport() {
      this.$router.push('/relatorio-produtos');
    },
  },
  created() {
    this.fetchProducts();
  }
};
</script>
