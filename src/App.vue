<template>
  <div class="app">
    <header class="hero">
      <p class="hero-label">Powered by Yelp</p>
      <h1 class="hero-title">Find <span>Restaurants</span><br />Near Any City</h1>
      <p class="hero-sub">Real reviews, real ratings, real results</p>

      <div class="search-bar">
        <input
          v-model="city"
          class="search-input"
          type="text"
          placeholder="Enter a city (e.g. New York, Chicago...)"
          @keydown.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch" :disabled="loading">
          {{ loading ? 'Searching...' : 'Search' }}
        </button>
      </div>

      <div class="stats-row">
        <div class="stat">
          <div class="stat-num">8</div>
          <div class="stat-label">Results</div>
        </div>
        <div class="stat">
          <div class="stat-num">Real</div>
          <div class="stat-label">Yelp Data</div>
        </div>
        <div class="stat">
          <div class="stat-num">5mi</div>
          <div class="stat-label">Radius</div>
        </div>
      </div>
    </header>

    <main class="results-area">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Finding restaurants in {{ city }}...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>⚠️ {{ error }}</p>
        <button @click="handleSearch" class="retry-btn">Try Again</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="restaurants.length === 0" class="empty-state">
        <div class="empty-icon">🍽️</div>
        <h3>Ready to explore?</h3>
        <p>Enter a city above to find restaurants</p>
      </div>

      <!-- Results -->
      <div v-else>
        <div class="results-header">
          <div class="results-title">
            Restaurants in <strong>{{ searchedCity }}</strong>
          </div>
          <span class="results-count">{{ restaurants.length }} results</span>
        </div>

        <div class="cards-grid">
          <div v-for="(r, index) in restaurants" :key="r.id" class="card">
            <div class="card-image">
              <img
                :src="r.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop'"
                :alt="r.name"
                @error="handleImageError"
              />
              <span class="card-rank">#{{ index + 1 }}</span>
            </div>
            <div class="card-body">
              <div class="card-top">
                <span class="card-name">{{ r.name }}</span>
                <span class="card-rating">★ {{ r.rating }}</span>
              </div>
              <div class="card-reviews">{{ r.review_count }} reviews</div>
              <div class="card-address">📍 {{ formatAddress(r.location) }}</div>
              <span class="card-coords">
                {{ r.coordinates?.latitude?.toFixed(4) }}, {{ r.coordinates?.longitude?.toFixed(4) }}
              </span>
              <div class="card-tags">
                <span v-for="cat in r.categories?.slice(0, 2)" :key="cat.alias" class="card-tag">
                  {{ cat.title }}
                </span>
                <span class="card-open" :class="r.is_closed ? 'closed' : 'open'">
                  {{ r.is_closed ? '● Closed' : '● Open' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const city = ref('')
const searchedCity = ref('')
const loading = ref(false)
const error = ref(null)

const restaurants = ref([])

function formatAddress(location) {
  return location?.display_address?.join(', ') || 'Address not available'
}

function handleImageError(e) {
  e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop'
}

async function handleSearch() {
  if (!city.value.trim()) return

  loading.value = true
  error.value = null
  searchedCity.value = city.value

  try {
    const API_KEY = 'vetG740Hv4K0q4dEn7EdyYpo3wUaBK8X0pflSLru89Go19FdAB5ggG84qwJJwaM-5UrLVhnHY_iNKY9FSGc97PUaZPYHa3NVvDFpTx953w3qtjIEOQy5WuCuUSfUaXYx'
    const CORS_PROXY = 'https://corsproxy.io/?'
    
    const response = await fetch(
      CORS_PROXY + encodeURIComponent(`https://api.yelp.com/v3/businesses/search?term=restaurants&location=${encodeURIComponent(city.value)}&limit=8`),
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    )
    const data = await response.json()

    if (data.error) {
      error.value = data.error.description || 'Something went wrong'
      return
    }

    restaurants.value = data.businesses || []

    if (restaurants.value.length === 0) {
      error.value = 'No restaurants found for this city. Try another city!'
    }
  } catch (err) {
    error.value = 'Failed to fetch restaurants. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.app {
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  background: #f5f4f0;
}

.hero {
  background: #1a1a2e;
  padding: 3rem 2rem 2.5rem;
  text-align: center;
}

.hero-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #D85A30;
  margin-bottom: 0.75rem;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.hero-title span { color: #D85A30; }

.hero-sub {
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 2rem;
}

.search-bar {
  display: flex;
  max-width: 520px;
  margin: 0 auto;
  background: #fff;
  border-radius: 50px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.search-bar:focus-within { border-color: #D85A30; }

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  padding: 0.85rem 1.25rem;
  background: transparent;
  color: #1a1a2e;
}

.search-input::placeholder { color: #aaa; }

.search-btn {
  background: #D85A30;
  border: none;
  padding: 0 1.5rem;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 0 50px 50px 0;
  transition: background 0.2s;
  white-space: nowrap;
}

.search-btn:hover { background: #c04d25; }
.search-btn:disabled { background: #aaa; cursor: not-allowed; }

.stats-row {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 1.75rem;
}

.stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: #fff;
}

.stat-label {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.results-area {
  padding: 1.5rem 1.25rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-state {
  text-align: center;
  padding: 4rem 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #eee;
  border-top-color: #D85A30;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 4rem 1rem;
  color: #a32d2d;
}

.retry-btn {
  margin-top: 1rem;
  background: #D85A30;
  color: #fff;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 14px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.results-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.results-count {
  font-size: 12px;
  color: #999;
  background: #eee;
  padding: 3px 10px;
  border-radius: 20px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card:hover {
  border-color: #D85A30;
  box-shadow: 0 4px 20px rgba(216, 90, 48, 0.1);
}

.card-image {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.card:hover .card-image img { transform: scale(1.05); }

.card-rank {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #1a1a2e;
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 20px;
}

.card-body {
  flex: 1;
  padding: 0.85rem 1rem;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2px;
}

.card-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a2e;
}

.card-rating {
  font-size: 13px;
  font-weight: 500;
  color: #D85A30;
  flex-shrink: 0;
}

.card-reviews {
  font-size: 11px;
  color: #aaa;
  margin-bottom: 5px;
}

.card-address {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  line-height: 1.4;
}

.card-coords {
  font-size: 10px;
  color: #999;
  font-family: monospace;
  background: #f5f5f5;
  padding: 2px 7px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 8px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.card-tag {
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 4px;
  background: #faf0ed;
  color: #993C1D;
}

.card-open {
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 4px;
  font-weight: 500;
}

.card-open.open { background: #edfaf0; color: #1a7a3c; }
.card-open.closed { background: #faeaea; color: #a32d2d; }

@media (max-width: 1024px) {
  .cards-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .cards-grid { grid-template-columns: 1fr; }
  .hero-title { font-size: 1.8rem; }
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.2rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #888;
}
</style>