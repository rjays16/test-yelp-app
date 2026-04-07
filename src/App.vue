<template>
  <div class="app">
    <header class="hero">
      <div class="hero-content">
        <p class="hero-label">Restaurant Finder</p>
        <h1 class="hero-title">Discover Best<br /><span>Restaurants</span></h1>
        <p class="hero-sub">Real Yelp data for real food lovers</p>

        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="city"
            class="search-input"
            type="text"
            placeholder="Enter a city name..."
            @keydown.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch" :disabled="loading">
            {{ loading ? 'Searching...' : 'Search' }}
          </button>
        </div>
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
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Finding best restaurants in {{ city }}...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4M12 16h.01"/>
        </svg>
        <p>{{ error }}</p>
        <button @click="handleSearch" class="retry-btn">Try Again</button>
      </div>

      <div v-else-if="restaurants.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3>Ready to explore?</h3>
        <p>Enter a city name above to discover restaurants</p>
      </div>

      <div v-else>
        <div class="results-header">
          <div class="results-title">
            <span class="city-name">{{ searchedCity }}</span>
            <span class="results-count">{{ restaurants.length }} places found</span>
          </div>
        </div>

        <div class="cards-grid">
          <div v-for="(r, index) in restaurants" :key="r.id" class="card">
            <div class="card-image">
              <img
                :src="r.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop'"
                :alt="r.name"
                @error="handleImageError"
              />
              <div class="card-overlay">
                <span class="card-price">{{ r.price || '$' }}</span>
                <span class="card-rank">#{{ index + 1 }}</span>
              </div>
              <span class="card-status" :class="r.is_closed ? 'closed' : 'open'">
                {{ r.is_closed ? 'Closed' : 'Open Now' }}
              </span>
            </div>
            <div class="card-body">
              <h3 class="card-name">{{ r.name }}</h3>
              <div class="card-rating">
                <div class="stars">
                  <span v-for="n in 5" :key="n" :class="{ filled: n <= Math.round(r.rating) }">★</span>
                </div>
                <span class="rating-text">{{ r.rating }} ({{ r.review_count }})</span>
              </div>
              <div class="card-address">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{{ formatAddress(r.location) }}</span>
              </div>
              <div class="card-tags">
                <span v-for="cat in r.categories?.slice(0, 2)" :key="cat.alias" class="tag">
                  {{ cat.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>Powered by <strong>Yelp API</strong></p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const city = ref('')
const searchedCity = ref('')
const loading = ref(false)
const error = ref(null)
const restaurants = ref([])

const defaultCities = ['San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Austin', 'Boston', 'Denver', 'Portland']

onMounted(() => {
  const randomCity = defaultCities[Math.floor(Math.random() * defaultCities.length)]
  searchedCity.value = randomCity
  fetchRestaurants(randomCity)
})

async function fetchRestaurants(cityName) {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(
      import.meta.env.VITE_CORS_PROXY + encodeURIComponent(`https://api.yelp.com/v3/businesses/search?term=restaurants&location=${encodeURIComponent(cityName)}&limit=8`),
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_YELP_API_KEY}`,
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
      error.value = 'No restaurants found. Try another city!'
    }
  } catch (err) {
    error.value = 'Failed to fetch restaurants. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleSearch() {
  if (!city.value.trim()) return
  searchedCity.value = city.value
  fetchRestaurants(city.value)
}

function formatAddress(location) {
  return location?.display_address?.slice(0, 2).join(', ') || 'Address not available'
}

function handleImageError(e) {
  e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

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

.search-bar {
  display: flex;
  align-items: center;
  max-width: 520px;
  margin: 0 auto;
  background: #fff;
  border-radius: 60px;
  padding: 6px 6px 6px 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.search-bar:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #999;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  padding: 10px 15px;
  background: transparent;
  color: #1a1a2e;
}

.search-input::placeholder { color: #aaa; }

.search-btn {
  background: #D85A30;
  border: none;
  padding: 12px 28px;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  white-space: nowrap;
}

.search-btn:hover {
  background: #c04d25;
  transform: scale(1.02);
}

.search-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
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

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 5rem 1rem;
}

.loader {
  width: 50px;
  height: 50px;
  border: 3px solid #eee;
  border-top-color: #D85A30;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 1rem;
}

.error-state svg {
  width: 48px;
  height: 48px;
  color: #e74c3c;
  margin-bottom: 1rem;
}

.error-state p {
  color: #e74c3c;
  margin-bottom: 1.5rem;
}

.retry-btn {
  background: #D85A30;
  color: #fff;
  border: none;
  padding: 12px 32px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.retry-btn:hover { background: #c04d25; }

.empty-icon svg {
  width: 64px;
  height: 64px;
  color: #ddd;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #888;
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

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.card:hover .card-image img {
  transform: scale(1.08);
}

.card-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
}

.card-price {
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.card-rank {
  background: #D85A30;
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.card-status {
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.card-status.open {
  background: rgba(46, 204, 113, 0.9);
  color: #fff;
}

.card-status.closed {
  background: rgba(231, 76, 60, 0.9);
  color: #fff;
}

.card-body {
  padding: 1.25rem;
}

.card-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
  line-height: 1.3;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars span {
  color: #ddd;
  font-size: 14px;
}

.stars span.filled {
  color: #f39c12;
}

.rating-text {
  font-size: 13px;
  color: #666;
}

.card-address {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 12px;
}

.card-address svg {
  width: 16px;
  height: 16px;
  color: #999;
  flex-shrink: 0;
  margin-top: 2px;
}

.card-address span {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  background: #f5f5f5;
  color: #555;
  font-weight: 500;
}

.footer {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 14px;
}

.footer strong {
  color: #D85A30;
}

@media (max-width: 1024px) {
  .cards-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-title { font-size: 2.5rem; }
}

@media (max-width: 600px) {
  .cards-grid { grid-template-columns: 1fr; }
  .hero { padding: 3rem 1.5rem 2rem; }
  .hero-title { font-size: 2rem; }
  .hero-stats { gap: 1.5rem; }
  .stat-value { font-size: 1.5rem; }
  .search-bar { padding: 4px 4px 4px 16px; }
  .search-btn { padding: 10px 20px; }
}
</style>
