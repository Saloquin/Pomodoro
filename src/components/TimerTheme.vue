<script setup>
import { computed } from 'vue';
import { useThemeStore } from '@/stores/themes';
import ClockTimer from './timers/ClockTimer.vue';

const props = defineProps({
  timer: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    required: true
  }
});

const themeStore = useThemeStore();

// Détermine quel composant de timer utiliser en fonction du style choisi
const currentTimerComponent = computed(() => {
  return themeStore.timerStyle === 'clock' ? ClockTimer : null;
});
</script>

<template>
  <component 
    :is="currentTimerComponent"
    v-if="currentTimerComponent"
    :timer="timer"
    :progress="progress"
  />
  <div v-else class="bg-primary mt-36 w-40 h-20 relative flex justify-center items-center rounded-xl">
    <p class="absolute text-5xl text-white">{{ timer }}</p>
  </div>
</template>