<script setup>
import { ref, onBeforeUnmount, onMounted, watch } from 'vue';
import { useThemeStore } from '@/stores/themes';
import TimerTheme from '@/components/TimerTheme.vue';
import StateIndicator from '@/components/StateIndicator.vue';
import SettingsMenu from '@/components/SettingsMenu.vue';
import TimerText from '@/components/TimerText.vue';

const themeStore = useThemeStore();

// États
const savedSettings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
const isWorking = ref(savedSettings.isWorking ?? true);
const timer = ref(savedSettings.currentTime || '25:00');
const progress = ref(savedSettings.progress || 0);
const workTime = ref(savedSettings.workTime || '00:25');
const pauseTime = ref(savedSettings.pauseTime || '00:05');
const soundVolume = ref(savedSettings.soundVolume || 50);

// Sauvegarder les paramètres quand ils changent
watch([workTime, pauseTime, soundVolume, isWorking, timer, progress], () => {
  localStorage.setItem('pomodoroSettings', JSON.stringify({
    workTime: workTime.value,
    pauseTime: pauseTime.value,
    soundVolume: soundVolume.value,
    isWorking: isWorking.value,
    currentTime: timer.value,
    progress: progress.value
  }));
}, { deep: true });

// Refs pour le composant Timer
const timerComponent = ref(null);
const backgroundAudio = ref(null);

onMounted(() => {
  // Initialiser le thème au chargement
  themeStore.setTheme(themeStore.currentTheme);
  initBackgroundSound();
  
  // Initialiser le timer avec le temps de travail par défaut
  const initialMinutes = parseTimeString(workTime.value);
  timerComponent.value?.resetTimer(initialMinutes);
});

const playAlertSound = () => {
  const soundPath = themeStore.activeTheme.alarmSound || '/sound/alert.mp3';
  const audio = new Audio(soundPath);
  audio.volume = soundVolume.value / 100;
  audio.play();
};

const handleTimerComplete = () => {
  playAlertSound();
  switchMode();
};

const parseTimeString = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const switchMode = () => {
  isWorking.value = !isWorking.value;
  
  // Inverser les couleurs primary et secondary
  const theme = themeStore.activeTheme;
  if (!isWorking.value) {
    document.documentElement.style.setProperty('--primary', theme.secondaryColor);
    document.documentElement.style.setProperty('--secondary', theme.primaryColor);
  } else {
    document.documentElement.style.setProperty('--primary', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary', theme.secondaryColor);
  }
  
  const minutes = parseTimeString(isWorking.value ? workTime.value : pauseTime.value);
  timerComponent.value?.resetTimer(minutes);
};

const initBackgroundSound = () => {
  if (backgroundAudio.value) {
    backgroundAudio.value.pause();
    backgroundAudio.value = null;
  }
  
  if (themeStore.activeTheme.backgroundSound) {
    backgroundAudio.value = new Audio(themeStore.activeTheme.backgroundSound);
    backgroundAudio.value.loop = true;
    backgroundAudio.value.play();
  }
};

watch(() => themeStore.activeTheme.backgroundSound, initBackgroundSound);

// Écouter les changements de temps
const handleTimerUpdate = (minutes) => {
  timerComponent.value?.resetTimer(minutes);
};

// Nettoyage du timer avant la destruction du composant
onBeforeUnmount(() => {
  if (backgroundAudio.value) {
    backgroundAudio.value.pause();
    backgroundAudio.value = null;
  }
  timerComponent.value?.cleanup();
});
</script>

<template>
  <div class="min-h-screen text-white pt-6">
    <SettingsMenu
      v-model:workTime="workTime"
      v-model:pauseTime="pauseTime"
      v-model:soundVolume="soundVolume"
      @timer-update="handleTimerUpdate"
    />

    <div class="flex justify-center items-center flex-col m-4">
      <h1 class="font-bold text-4xl text-white">TIMER POMODORO</h1>

      <StateIndicator :is-working="isWorking" />

      <TimerTheme 
        :timer="timer"
        :progress="progress"
      />

      <TimerText
        ref="timerComponent"
        @update-timer="newTime => timer = newTime"
        @update-progress="newProgress => progress = newProgress"
        @timer-complete="handleTimerComplete"
      />
    </div>
  </div>
</template>

<style scoped>
.background-theme {
  transition: background-color 0.3s ease;
}
</style>