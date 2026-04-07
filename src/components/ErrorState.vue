<template>
  <div class="error-state">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4M12 16h.01"/>
    </svg>
    <p>{{ message }}</p>
    <button @click="$emit('retry')" class="retry-btn">Try Again</button>
  </div>
</template>

<script setup>
defineProps({
  message: String,
})

defineEmits(['retry'])
</script>

<style scoped>
.error-state {
  text-align: center;
  padding: 5rem 1rem;
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
</style>
