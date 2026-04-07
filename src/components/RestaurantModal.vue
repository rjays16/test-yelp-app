<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <button class="close-btn" @click="close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div class="modal-header">
          <img :src="restaurant.image_url || fallbackImage" :alt="restaurant.name" class="modal-image" />
          <div class="modal-info">
            <h2>{{ restaurant.name }}</h2>
            <div class="modal-rating">
              <span v-for="n in 5" :key="n" :class="{ filled: n <= Math.round(restaurant.rating) }">★</span>
              <span class="rating-text">{{ restaurant.rating }} ({{ restaurant.review_count }} reviews)</span>
            </div>
            <p class="modal-address">{{ formatAddress(restaurant.location) }}</p>
            <span class="modal-status" :class="restaurant.is_closed ? 'closed' : 'open'">
              {{ restaurant.is_closed ? 'Currently Closed' : 'Open Now' }}
            </span>
          </div>
        </div>

        <div class="modal-map">
          <iframe
            :src="mapUrl"
            width="100%"
            height="300"
            style="border:0"
            allowfullscreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div class="modal-categories">
          <span v-for="cat in restaurant.categories" :key="cat.alias" class="category-tag">
            {{ cat.title }}
          </span>
        </div>

        <div class="modal-footer">
          <a :href="restaurant.url" target="_blank" class="yelp-link">
            View on Yelp
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
          </a>
          <span class="modal-price">{{ restaurant.price || '$' }}</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  restaurant: Object,
})

const emit = defineEmits(['close'])

const fallbackImage = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop'

const mapUrl = computed(() => {
  if (!props.restaurant?.coordinates) return ''
  const { latitude, longitude } = props.restaurant.coordinates
  return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${latitude},${longitude}&zoom=15`
})

function formatAddress(location) {
  return location?.display_address?.join(', ') || 'Address not available'
}

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: #fff;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #fff;
}

.close-btn svg {
  width: 20px;
  height: 20px;
  color: #333;
}

.modal-header {
  position: relative;
}

.modal-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.modal-info {
  padding: 1.5rem;
}

.modal-info h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 0.75rem;
}

.modal-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 0.75rem;
}

.modal-rating span {
  color: #ddd;
  font-size: 18px;
}

.modal-rating span.filled {
  color: #f39c12;
}

.rating-text {
  font-size: 14px;
  color: #666;
  margin-left: 8px;
}

.modal-address {
  font-size: 14px;
  color: #666;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.modal-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.modal-status.open {
  background: #edfaf0;
  color: #1a7a3c;
}

.modal-status.closed {
  background: #faeaea;
  color: #a32d2d;
}

.modal-map {
  border-radius: 0;
  overflow: hidden;
}

.modal-categories {
  padding: 1rem 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  padding: 6px 14px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 13px;
  color: #555;
}

.modal-footer {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.yelp-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #D85A30;
  color: #fff;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;
}

.yelp-link:hover {
  background: #c04d25;
}

.yelp-link svg {
  width: 16px;
  height: 16px;
}

.modal-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a2e;
}
</style>
