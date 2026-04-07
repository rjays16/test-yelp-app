<template>
  <div class="card" @click="$emit('click')">
    <div class="card-image">
      <img
        :src="restaurant.image_url || fallbackImage"
        :alt="restaurant.name"
        @error="handleImageError"
      />
      <div class="card-overlay">
        <span class="card-price">{{ restaurant.price || '$' }}</span>
        <span class="card-rank">#{{ index + 1 }}</span>
      </div>
      <span class="card-status" :class="restaurant.is_closed ? 'closed' : 'open'">
        {{ restaurant.is_closed ? 'Closed' : 'Open Now' }}
      </span>
    </div>
    <div class="card-body">
      <h3 class="card-name">{{ restaurant.name }}</h3>
      <div class="card-rating">
        <div class="stars">
          <span v-for="n in 5" :key="n" :class="{ filled: n <= Math.round(restaurant.rating) }">★</span>
        </div>
        <span class="rating-text">{{ restaurant.rating }} ({{ restaurant.review_count }})</span>
      </div>
      <div class="card-address">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>{{ formatAddress(restaurant.location) }}</span>
      </div>
      <div class="card-tags">
        <span v-for="cat in restaurant.categories?.slice(0, 2)" :key="cat.alias" class="tag">
          {{ cat.title }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  restaurant: Object,
  index: Number,
})

defineEmits(['click'])

const fallbackImage = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop'

function formatAddress(location) {
  return location?.display_address?.slice(0, 2).join(', ') || 'Address not available'
}

function handleImageError(e) {
  e.target.src = fallbackImage
}
</script>

<style scoped>
.card {
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  border: 1px solid var(--border-color);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
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
  background: var(--accent);
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
  color: var(--text-primary);
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
  color: var(--text-secondary);
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
  color: var(--text-secondary);
  flex-shrink: 0;
  margin-top: 2px;
}

.card-address span {
  font-size: 13px;
  color: var(--text-secondary);
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
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 500;
}
</style>
