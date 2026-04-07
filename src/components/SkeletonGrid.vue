<template>
  <div class="skeleton-grid">
    <SkeletonCard v-for="n in 8" :key="n" />
  </div>
</template>

<script setup>
import SkeletonCard from './SkeletonCard.vue'
</script>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .skeleton-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .skeleton-grid { grid-template-columns: 1fr; }
}
</style>
