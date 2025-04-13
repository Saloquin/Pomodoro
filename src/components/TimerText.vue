<script setup>
import { ref, defineExpose, defineEmits, watch, onMounted } from 'vue';

const emit = defineEmits(['updateTimer', 'updateProgress', 'timerComplete']);

// États du timer
const savedSettings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
const isPaused = ref(true);
const totalSeconds = ref(1500); // 25 minutes par défaut
const currentSeconds = ref(savedSettings.currentSeconds || totalSeconds.value);
let intervalId = null;

// Fonctions du timer
const startTimer = () => {
  isPaused.value = !isPaused.value;
  if (!isPaused.value) {
    intervalId = setInterval(updateTimer, 1000);
  } else {
    clearInterval(intervalId);
  }
  return isPaused.value;
};

const updateTimer = () => {
  if (currentSeconds.value > 0) {
    currentSeconds.value--;
    updateTimerDisplay();
    updateProgress();
    // Sauvegarder l'état actuel
    const pomodoroSettings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
    localStorage.setItem('pomodoroSettings', JSON.stringify({
      ...pomodoroSettings,
      currentSeconds: currentSeconds.value
    }));
  } else {
    emit('timerComplete');
  }
};

const updateTimerDisplay = () => {
  const minutes = Math.floor(currentSeconds.value / 60);
  const seconds = currentSeconds.value % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  emit('updateTimer', timeString);
};

const updateProgress = () => {
  const progress = ((totalSeconds.value - currentSeconds.value) / totalSeconds.value) * 238.76;
  emit('updateProgress', progress);
};

const resetTimer = (minutes) => {
  clearInterval(intervalId);
  isPaused.value = true;
  totalSeconds.value = minutes * 60;
  currentSeconds.value = totalSeconds.value;
  updateTimerDisplay();
  updateProgress();
};

onMounted(() => {
  // Restaurer l'état exact du timer
  currentSeconds.value = savedSettings.currentSeconds || totalSeconds.value;
  updateTimerDisplay();
  updateProgress();
});

// S'assurer que l'intervalle est nettoyé quand le composant est détruit
const cleanup = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};

defineExpose({
  startTimer,
  resetTimer,
  isPaused,
  cleanup
});
</script>

<template>
  <div class="rounded-full bg-primary border border-4 border-white w-24 h-24 flex justify-center items-center mt-10">
    <button @click="startTimer" class="h-full w-full">
      <span :class="['fa-solid', isPaused ? 'fa-play' : 'fa-pause', 'fa-2xl']"></span>
    </button>
  </div>
</template>