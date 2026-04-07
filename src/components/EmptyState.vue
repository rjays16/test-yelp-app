<template>
  <div class="empty-state">
    <div class="empty-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
    </div>
    <h3>Ready to explore?</h3>
    <p>Enter a city name above to discover restaurants</p>
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 5rem 1rem;
}

.empty-icon svg {
  width: 64px;
  height: 64px;
  color: #ddd;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #888;
}
</style>
