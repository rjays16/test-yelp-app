<template>
  <div class="radius-toggle">
    <span class="label">{{ modelValue ? '5 mi' : 'All' }}</span>
    <button 
      class="toggle-btn" 
      :class="{ active: modelValue }"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <span class="slider"></span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.radius-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.toggle-btn {
  width: 44px;
  height: 24px;
  border-radius: 20px;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  padding: 0;
}

.toggle-btn.active {
  background: var(--accent);
  border-color: var(--accent);
}

.slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.3s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.toggle-btn.active .slider {
  transform: translateX(20px);
}
</style>
