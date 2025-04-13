<script setup>
import { RouterView } from 'vue-router';
import { useThemeStore } from '@/stores/themes';
import { onMounted } from 'vue';

const themeStore = useThemeStore();

onMounted(() => {
  themeStore.setTheme(themeStore.currentTheme);
});
</script>

<template>
  <RouterView />
</template>

<style>
@import '@/assets/main.css';

html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
}

body {
  background-color: var(--primary);
  transition: background-color 0.3s ease;
}

#app {
  height: 100vh;
}
</style>

