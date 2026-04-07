<template>
  <div class="cards-grid">
    <RestaurantCard
      v-for="(restaurant, index) in restaurants"
      :key="restaurant.id"
      :restaurant="restaurant"
      :index="index"
      @click="$emit('select', restaurant)"
    />
  </div>
</template>

<script setup>
import RestaurantCard from './RestaurantCard.vue'

defineProps({
  restaurants: Array,
})

defineEmits(['select'])
</script>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .cards-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .cards-grid { grid-template-columns: 1fr; }
}
</style>
