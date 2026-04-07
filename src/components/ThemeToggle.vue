<template>
  <button class="theme-toggle" @click="toggle" :title="isDark ? 'Light Mode' : 'Dark Mode'">
    <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </button>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'

const { isDark, toggle } = useTheme()
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.3s;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.theme-toggle svg {
  width: 22px;
  height: 22px;
  color: #fff;
}

:global(.dark) .theme-toggle {
  background: rgba(0, 0, 0, 0.3);
}

:global(.dark) .theme-toggle:hover {
  background: rgba(0, 0, 0, 0.5);
}

@media (max-width: 600px) {
  .theme-toggle {
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
  }
}
</style>
