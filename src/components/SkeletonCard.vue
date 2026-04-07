<template>
  <div class="skeleton-card">
    <div class="skeleton-image"></div>
    <div class="skeleton-body">
      <div class="skeleton-line title"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-line address"></div>
      <div class="skeleton-tags">
        <div class="skeleton-tag"></div>
        <div class="skeleton-tag"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.skeleton-image {
  height: 200px;
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--skeleton-highlight) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-body {
  padding: 1.25rem;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--skeleton-highlight) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 12px;
}

.skeleton-line.title {
  width: 70%;
  height: 16px;
}

.skeleton-line.short {
  width: 40%;
  height: 10px;
}

.skeleton-line.address {
  width: 90%;
}

.skeleton-tags {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.skeleton-tag {
  width: 60px;
  height: 24px;
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--skeleton-highlight) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 20px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
