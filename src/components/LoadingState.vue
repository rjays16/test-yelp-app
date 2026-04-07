<template>
  <div class="loading-state">
    <div class="loader"></div>
    <p>Finding best restaurants...</p>
  </div>
</template>

<style scoped>
.loading-state {
  text-align: center;
  padding: 5rem 1rem;
}

.loader {
  width: 50px;
  height: 50px;
  border: 3px solid #eee;
  border-top-color: #D85A30;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 1rem;
}
</style>
