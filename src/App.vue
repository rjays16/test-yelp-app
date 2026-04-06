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
        <button class="search-btn" @click="handleSearch">Search</button>
      </div>

      <div class="stats-row">
        <div class="stat">
          <div class="stat-num">20+</div>
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
      <div class="results-header">
        <div class="results-title">
          <span v-if="searched">Restaurants in <strong>{{ searchedCity }}</strong></span>
          <span v-else>🔥 Popular Restaurants</span>
        </div>
        <span class="results-count">{{ restaurants.length }} results</span>
      </div>

      <div class="cards-grid">
        <div v-for="(r, index) in restaurants" :key="r.id" class="card">
          <div class="card-image">
            <img :src="r.image" :alt="r.name" />
            <span class="card-rank">#{{ index + 1 }}</span>
          </div>
          <div class="card-body">
            <div class="card-top">
              <span class="card-name">{{ r.name }}</span>
              <span class="card-rating">★ {{ r.rating }}</span>
            </div>
            <div class="card-reviews">{{ r.reviews }} reviews</div>
            <div class="card-address">📍 {{ r.address }}</div>
            <span class="card-coords">{{ r.coords }}</span>
            <div class="card-tags">
              <span v-for="tag in r.tags" :key="tag" class="card-tag">{{ tag }}</span>
              <span class="card-open" :class="r.open ? 'open' : 'closed'">
                {{ r.open ? '● Open' : '● Closed' }}
              </span>
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
const searched = ref(false)

const restaurants = ref([
  {
    id: 1,
    name: 'The Golden Fork',
    rating: 4.7,
    reviews: 320,
    address: '123 Market St, San Francisco, CA',
    coords: '37.7749, -122.4194',
    tags: ['American', 'Brunch'],
    open: true,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&h=200&fit=crop'
  },
  {
    id: 2,
    name: 'Sakura Ramen House',
    rating: 4.5,
    reviews: 215,
    address: '456 Fillmore St, San Francisco, CA',
    coords: '37.7751, -122.4320',
    tags: ['Japanese', 'Ramen'],
    open: true,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop'
  },
  {
    id: 3,
    name: 'Trattoria Bella',
    rating: 4.8,
    reviews: 498,
    address: '789 Columbus Ave, San Francisco, CA',
    coords: '37.7998, -122.4078',
    tags: ['Italian', 'Pizza'],
    open: false,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop'
  },
  {
    id: 4,
    name: 'La Cocina Tacos',
    rating: 4.4,
    reviews: 180,
    address: '321 Mission St, San Francisco, CA',
    coords: '37.7853, -122.3984',
    tags: ['Mexican', 'Tacos'],
    open: true,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=200&fit=crop'
  },
  {
    id: 5,
    name: 'Harbor View Seafood',
    rating: 4.6,
    reviews: 374,
    address: '1 Ferry Building, San Francisco, CA',
    coords: '37.7955, -122.3937',
    tags: ['Seafood', 'Fine Dining'],
    open: true,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&h=200&fit=crop'
  },
  {
    id: 6,
    name: 'Burger & Barrels',
    rating: 4.3,
    reviews: 142,
    address: '88 Haight St, San Francisco, CA',
    coords: '37.7724, -122.4298',
    tags: ['Burgers', 'American'],
    open: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'
  },
  {
    id: 7,
    name: 'Spice Garden Indian',
    rating: 4.5,
    reviews: 267,
    address: '202 Valencia St, San Francisco, CA',
    coords: '37.7686, -122.4218',
    tags: ['Indian', 'Curry'],
    open: false,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop'
  },
  {
    id: 8,
    name: 'The Vegan Table',
    rating: 4.6,
    reviews: 193,
    address: '510 Castro St, San Francisco, CA',
    coords: '37.7609, -122.4350',
    tags: ['Vegan', 'Healthy'],
    open: true,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop'
  },
])

function handleSearch() {
  if (!city.value.trim()) return
  searchedCity.value = city.value
  searched.value = true
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
  max-width: 860px;
  margin: 0 auto;
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
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  display: flex;
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
  width: 140px;
  min-width: 140px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

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
  padding: 1rem 1.25rem;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2px;
}

.card-name {
  font-size: 15px;
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
  font-size: 12px;
  color: #aaa;
  margin-bottom: 6px;
}

.card-address {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.card-coords {
  font-size: 11px;
  color: #999;
  font-family: monospace;
  background: #f5f5f5;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 8px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
}

.card-tag {
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 4px;
  background: #faf0ed;
  color: #993C1D;
}

.card-open {
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 4px;
  font-weight: 500;
}

.card-open.open {
  background: #edfaf0;
  color: #1a7a3c;
}

.card-open.closed {
  background: #faeaea;
  color: #a32d2d;
}
</style>