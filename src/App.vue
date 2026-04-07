<template>
  <div class="app">
    <header class="hero">
      <div class="hero-content">
        <p class="hero-label">Restaurant Finder</p>
        <h1 class="hero-title">Discover Best<br /><span>Restaurants</span></h1>
        <p class="hero-sub">Real Yelp data for real food lovers</p>

        <SearchBar :loading="loading" @search="searchCity" />
      </div>

      <div class="hero-stats">
        <div class="stat">
          <span class="stat-value">{{ restaurants.length }}</span>
          <span class="stat-label">Restaurants</span>
        </div>
        <div class="stat">
          <span class="stat-value">5 mi</span>
          <span class="stat-label">Radius</span>
        </div>
        <div class="stat">
          <span class="stat-value">Yelp</span>
          <span class="stat-label">Data Source</span>
        </div>
      </div>
    </header>

    <main class="results-area">
      <LoadingState v-if="loading" />

      <ErrorState v-else-if="error" :message="error" @retry="retrySearch" />

      <EmptyState v-else-if="restaurants.length === 0" />

      <div v-else>
        <div class="results-header">
          <div class="results-title">
            <span class="city-name">{{ searchedCity }}</span>
            <span class="results-count">{{ restaurants.length }} places found</span>
          </div>
        </div>

        <RestaurantGrid :restaurants="restaurants" />
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useYelp } from './composables/useYelp'
import SearchBar from './components/SearchBar.vue'
import RestaurantCard from './components/RestaurantCard.vue'
import RestaurantGrid from './components/RestaurantGrid.vue'
import LoadingState from './components/LoadingState.vue'
import ErrorState from './components/ErrorState.vue'
import EmptyState from './components/EmptyState.vue'
import Footer from './components/Footer.vue'

const { restaurants, loading, error, searchedCity, loadRandomCity, searchCity } = useYelp()

let lastSearchedCity = ''

function retrySearch() {
  if (lastSearchedCity) {
    searchCity(lastSearchedCity)
  }
}

function handleSearch(city) {
  lastSearchedCity = city
  searchCity(city)
}

onMounted(() => {
  loadRandomCity()
})
</script>

<style scoped>
.app {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: #fafafa;
}

.hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 4rem 2rem 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(216, 90, 48, 0.1) 0%, transparent 50%);
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
}

.hero-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #D85A30;
  margin-bottom: 1rem;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.hero-title span {
  color: #D85A30;
  display: inline-block;
}

.hero-sub {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2.5rem;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 3rem;
  position: relative;
  z-index: 1;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 4px;
}

.results-area {
  padding: 3rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
  min-height: 400px;
}

.results-header {
  margin-bottom: 2rem;
}

.results-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.city-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a2e;
}

.results-count {
  font-size: 14px;
  color: #888;
  background: #f0f0f0;
  padding: 6px 14px;
  border-radius: 20px;
}

@media (max-width: 600px) {
  .hero { padding: 3rem 1.5rem 2rem; }
  .hero-title { font-size: 2rem; }
  .hero-stats { gap: 1.5rem; }
  .stat-value { font-size: 1.5rem; }
}
</style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
</style>
