<script setup>
import { ref, onBeforeUnmount, onMounted, watch } from 'vue';
import { useThemeStore } from '@/stores/themes';
import TimerTheme from '@/components/TimerTheme.vue';
import StateIndicator from '@/components/StateIndicator.vue';
import SettingsMenu from '@/components/SettingsMenu.vue';
import TimerText from '@/components/TimerText.vue';
import ThemeGifs from '@/components/ThemeGifs.vue';

const themeStore = useThemeStore();

// États
const savedSettings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
const isWorking = ref(true);
const timer = ref('25:00');
const progress = ref(0);
const workTime = ref(savedSettings.workTime || '00:25');
const pauseTime = ref(savedSettings.pauseTime || '00:05');
const soundVolume = ref(savedSettings.soundVolume || 50);

// Sauvegarder les paramètres quand ils changent
watch([workTime, pauseTime, soundVolume], () => {
  const settings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
  localStorage.setItem('pomodoroSettings', JSON.stringify({
    ...settings,
    workTime: workTime.value,
    pauseTime: pauseTime.value,
    soundVolume: soundVolume.value
  }));
});

// Refs pour le composant Timer
const timerComponent = ref(null);

onMounted(() => {
  // Initialiser le thème au chargement
  themeStore.setTheme(themeStore.currentTheme);
  
  // Avertir lors de l'actualisation
  window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = 'Attention : voulez-vous vraiment recharger la page ? Votre temps de travail sera perdu.';
  });

  // Restaurer les paramètres sauvegardés
  if (savedSettings.workTime) {
    workTime.value = savedSettings.workTime;
  }
  if (savedSettings.pauseTime) {
    pauseTime.value = savedSettings.pauseTime;
  }
  if (savedSettings.soundVolume !== undefined) {
    soundVolume.value = savedSettings.soundVolume;
  }

  // Initialiser le timer avec le temps de travail actuel
  const [hours, minutes] = workTime.value.split(':').map(Number);
  const totalMinutes = (hours * 60) + minutes;
  timerComponent.value?.resetTimer(totalMinutes);
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
  const totalMinutes = (hours * 60) + minutes;
  return totalMinutes;
};

const switchMode = () => {
  isWorking.value = !isWorking.value;
  
  const minutes = parseTimeString(isWorking.value ? workTime.value : pauseTime.value);
  timerComponent.value?.resetTimer(minutes);
};

// Écouter les changements de temps
const handleTimerUpdate = (minutes) => {
  // S'assurer que minutes est un nombre
  const minutesNum = Number(minutes);
  if (!isNaN(minutesNum) && minutesNum > 0) {
    timerComponent.value?.resetTimer(minutesNum);
  }
};

// Nettoyage du timer avant la destruction du composant
onBeforeUnmount(() => {
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

      <div class="flex justify-center items-center relative w-full">
        <ThemeGifs :gifs="themeStore.activeTheme.gifs" />
        
        <div class="flex flex-col items-center">
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
    </div>
  </div>
</template>

<style scoped>
.background-theme {
  transition: background-color 0.3s ease;
}
</style>