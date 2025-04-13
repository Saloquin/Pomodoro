<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  gifs: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <div class="gifs-container">
    <div v-for="(gif, index) in gifs" :key="index" class="gif-wrapper mb-4 bg-gray-400 rounded-2xl">
      <img :src="gif" alt="Theme animation" class="theme-gif"/>
    </div>
  </div>
</template>

<style scoped>
.gifs-container {
  position: absolute;
  left: 15%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  z-index: 10;
}

.theme-gif {
  max-width: 300px;
  height: auto;
  border: 2px solid var(--accent);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1200px) {
  .gifs-container {
    position: static;
    transform: none;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    margin: 2rem 0;
    width: 100%;
  }

  .theme-gif {
    max-width: 300px;
  }
}
</style>