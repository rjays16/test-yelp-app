<template>
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
    <button class="search-btn" @click="handleSearch" :disabled="loading || !city.trim()">
      {{ loading ? 'Searching...' : 'Search' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  loading: Boolean,
})

const emit = defineEmits(['search'])

const city = ref('')

function handleSearch() {
  if (!city.value.trim()) return
  emit('search', city.value)
  city.value = ''
}
</script>

<style scoped>
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
  background: var(--accent);
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

.search-btn:hover:not(:disabled) {
  background: #c04d25;
  transform: scale(1.02);
}

.search-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 600px) {
  .search-bar { padding: 4px 4px 4px 16px; }
  .search-btn { padding: 10px 20px; }
}
</style>
