<template>
  <div class="app">
    <ThemeToggle />

    <header class="hero">
      <div class="hero-content">
        <p class="hero-label">Restaurant Finder</p>
        <h1 class="hero-title">Discover Best<br /><span>Restaurants</span></h1>
        <p class="hero-sub">Real Yelp data for real food lovers</p>

        <SearchBar :loading="loading" @search="handleCitySearch" />
      </div>

      <div class="hero-stats">
        <div class="stat">
          <span class="stat-value">{{ totalCount }}</span>
          <span class="stat-label">Found</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ searchedCity }}</span>
          <span class="stat-label">City</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ totalPages }}</span>
          <span class="stat-label">Pages</span>
        </div>
      </div>
    </header>

    <main class="results-area">
      <SkeletonGrid v-if="loading" />

      <ErrorState v-else-if="error" :message="error" @retry="retrySearch" />

      <EmptyState v-else-if="restaurants.length === 0" />

      <div v-else>
        <div class="results-header">
          <div class="results-title">
            <span class="city-name">{{ searchedCity }}</span>
            <span class="results-count">{{ currentPage }} of {{ totalPages }} pages</span>
          </div>
        </div>

        <RestaurantGrid :restaurants="paginatedRestaurants" @select="openModal" />

        <div v-if="totalPages > 1" class="pagination">
          <button 
            class="page-btn" 
            :disabled="currentPage === 1" 
            @click="prevPage"
          >
            Previous
          </button>
          
          <div class="page-numbers">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              class="page-num"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button 
            class="page-btn" 
            :disabled="currentPage === totalPages" 
            @click="nextPage"
          >
            Next
          </button>
        </div>
      </div>
    </main>

    <Footer />

    <RestaurantModal 
      :isOpen="isModalOpen" 
      :restaurant="selectedRestaurant"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useYelp } from './composables/useYelp'
import { useTheme } from './composables/useTheme'
import ThemeToggle from './components/ThemeToggle.vue'
import SearchBar from './components/SearchBar.vue'
import RestaurantCard from './components/RestaurantCard.vue'
import Footer from './components/Footer.vue'
import RestaurantGrid from './components/grid/RestaurantGrid.vue'
import SkeletonGrid from './components/grid/SkeletonGrid.vue'
import EmptyState from './components/states/EmptyState.vue'
import ErrorState from './components/states/ErrorState.vue'
import RestaurantModal from './components/modal/RestaurantModal.vue'

useTheme().init()

const ITEMS_PER_PAGE = 8

const { restaurants, loading, error, searchedCity, loadRandomCity, searchCity } = useYelp()
const currentPage = ref(1)
const isModalOpen = ref(false)
const selectedRestaurant = ref(null)

const totalCount = computed(() => restaurants.value.length)
const totalPages = computed(() => Math.ceil(restaurants.value.length / ITEMS_PER_PAGE) || 1)

const paginatedRestaurants = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return restaurants.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 3; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  return pages
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function goToPage(page) {
  if (page !== '...') currentPage.value = page
}

function openModal(restaurant) {
  selectedRestaurant.value = restaurant
  isModalOpen.value = true
}

let lastSearchedCity = ''

function retrySearch() {
  if (lastSearchedCity) {
    searchCity(lastSearchedCity)
  }
}

function handleCitySearch(city) {
  if (!city?.trim()) return
  lastSearchedCity = city
  currentPage.value = 1
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
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background 0.3s, color 0.3s;
}

.hero {
  background: linear-gradient(135deg, var(--hero-start) 0%, var(--hero-mid) 50%, var(--hero-end) 100%);
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
  color: var(--accent);
  margin-bottom: 1rem;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--text-light);
  line-height: 1.1;
  margin-bottom: 1rem;
}

.hero-title span {
  color: var(--accent);
  display: inline-block;
}

.hero-sub {
  font-size: 1.1rem;
  color: var(--text-light-secondary);
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
  color: var(--text-light);
}

.stat-label {
  font-size: 12px;
  color: var(--text-light-secondary);
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
  color: var(--text-primary);
}

.results-count {
  font-size: 14px;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 6px 14px;
  border-radius: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 3rem;
}

.page-btn {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-num {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  transition: all 0.2s;
}

.page-num:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.page-num.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
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

:root {
  --bg-primary: #fafafa;
  --bg-secondary: #f0f0f0;
  --card-bg: #fff;
  --text-primary: #1a1a2e;
  --text-secondary: #888;
  --text-light: #fff;
  --text-light-secondary: rgba(255, 255, 255, 0.6);
  --accent: #D85A30;
  --border-color: #ddd;
  --hero-start: #1a1a2e;
  --hero-mid: #16213e;
  --hero-end: #0f3460;
  --skeleton-highlight: #e8e8e8;
}

.dark {
  --bg-primary: #0f0f1a;
  --bg-secondary: #1a1a2e;
  --card-bg: #1a1a2e;
  --text-primary: #f0f0f0;
  --text-secondary: #888;
  --border-color: #333;
  --hero-start: #0a0a14;
  --hero-mid: #0f0f1a;
  --hero-end: #1a1a2e;
  --skeleton-highlight: #252540;
}
</style>
