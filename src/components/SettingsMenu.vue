<script setup>
import { ref, watch } from 'vue';
import { useThemeStore } from '@/stores/themes';

const themeStore = useThemeStore();

const props = defineProps({
  workTime: {
    type: String,
    required: true
  },
  pauseTime: {
    type: String,
    required: true
  },
  soundVolume: {
    type: Number,
    required: true
  }
});

const emit = defineEmits([
  'update:workTime',
  'update:pauseTime',
  'update:soundVolume',
  'timer-update'
]);

// Auto-save when work time or pause time changes
watch(() => props.workTime, (newValue) => {
  const [hours, minutes] = newValue.split(':').map(Number);
  if (!isNaN(hours) && !isNaN(minutes)) {
    const totalMinutes = (hours * 60) + minutes;
    if (totalMinutes > 0) {
      emit('timer-update', totalMinutes);
    }
  }
});

watch(() => props.pauseTime, (newValue) => {
  const [hours, minutes] = newValue.split(':').map(Number);
  if (!isNaN(hours) && !isNaN(minutes)) {
    const totalMinutes = (hours * 60) + minutes;
    if (totalMinutes > 0) {
      emit('timer-update', totalMinutes);
    }
  }
});

const handleTimeInput = (event, type) => {
  const value = event.target.value;
  emit(`update:${type}`, value);
  
  const [hours, minutes] = value.split(':').map(Number);
  if (!isNaN(hours) && !isNaN(minutes)) {
    const totalMinutes = (hours * 60) + minutes;
    if (totalMinutes > 0) {
      emit('timer-update', totalMinutes);
    }
  }
};

// Pour s'assurer que le thème est appliqué quand il change
watch(() => themeStore.currentTheme, (newTheme) => {
  themeStore.setTheme(newTheme);
}, { immediate: true });

const alarmSounds = [
  { name: 'Chill', path: '/Pomodoro/sound/alarm/chill.mp3' },
  { name: 'Cute', path: '/Pomodoro/sound/alarm/Cute.mp3' },
  { name: 'Feu de camp', path: '/Pomodoro/sound/alarm/firecamp.mp3' },
  { name: 'Galaxy', path: '/Pomodoro/sound/alarm/galaxy.mp3' },
  { name: 'Grove', path: '/Pomodoro/sound/alarm/grove.mp3' },
  { name: 'Ice Cream', path: '/Pomodoro/sound/alarm/iceCream.mp3' },
  { name: 'Kawaii', path: '/Pomodoro/sound/alarm/kawaii.mp3' },
  { name: 'Magic', path: '/Pomodoro/sound/alarm/magic.mp3' },
  { name: 'Notification', path: '/Pomodoro/sound/alarm/notif.mp3' },
  { name: 'Phone', path: '/Pomodoro/sound/alarm/phoneBell.mp3' },
  { name: 'Tirelire', path: '/Pomodoro/sound/alarm/piggyBank.mp3' },
  { name: 'Pompom', path: '/Pomodoro/sound/alarm/pompom.mp3' },
  { name: 'Pop', path: '/Pomodoro/sound/alarm/pop.mp3' },
  { name: 'Reverb', path: '/Pomodoro/sound/alarm/Reverb.mp3' },
  { name: 'Shooting Star', path: '/Pomodoro/sound/alarm/shootingStar.mp3' },
  { name: 'Star', path: '/Pomodoro/sound/alarm/star.mp3' },
  { name: 'Sweet', path: '/Pomodoro/sound/alarm/Sweet.mp3' },
  { name: 'Treasure', path: '/Pomodoro/sound/alarm/Treasure.mp3' }
];

const previewSound = (soundPath) => {
  if (soundPath) {
    const audio = new Audio(soundPath);
    audio.volume = props.soundVolume / 100;
    audio.play();
  }
};

const localCustomTheme = ref({
  primaryColor: themeStore.customTheme.primaryColor,
  secondaryColor: themeStore.customTheme.secondaryColor,
  accentColor: themeStore.customTheme.accentColor,
  backgroundImage: themeStore.customTheme.backgroundImage,
  alarmSound: themeStore.customTheme.alarmSound
});

// Pour s'assurer que localCustomTheme est synchronisé quand on bascule entre personnalisé et prédéfini
watch(() => themeStore.showCustomTheme, () => {
  localCustomTheme.value = {
    primaryColor: themeStore.customTheme.primaryColor,
    secondaryColor: themeStore.customTheme.secondaryColor,
    accentColor: themeStore.customTheme.accentColor,
    backgroundImage: themeStore.customTheme.backgroundImage,
    alarmSound: themeStore.customTheme.alarmSound
  };
});

const updateTheme = () => {
  themeStore.updateCustomTheme(localCustomTheme.value);
};

const resetTheme = () => {
  themeStore.resetCustomTheme();
  // Mettre à jour le thème local avec les nouvelles valeurs
  localCustomTheme.value = {
    primaryColor: themeStore.customTheme.primaryColor,
    secondaryColor: themeStore.customTheme.secondaryColor,
    accentColor: themeStore.customTheme.accentColor,
    backgroundImage: themeStore.customTheme.backgroundImage,
    alarmSound: themeStore.customTheme.alarmSound
  };
};

</script>

<template>
  <div class="absolute top-6 right-6">
    <button
      id="dropdownTimepickerButton"
      class="text-white bg-black/50 hover:bg-black/70 focus:ring-4 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
      @click="$refs.dropdownTimepicker.classList.toggle('hidden')"
    >
      <i class="fas fa-cog mr-2"></i>
      Options
      <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
      </svg>
    </button>

    <div ref="dropdownTimepicker" class="z-10 hidden bg-gray-800 rounded-lg shadow w-80 p-4 absolute right-0 mt-2">
      <!-- Options de temps -->
      <div class="mb-4">
        <h3 class="text-lg font-medium text-white mb-3">Temps</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="work-time" class="block mb-2 text-sm font-medium text-white">Temps de travail</label>
            <input
              type="time"
              id="work-time"
              :value="workTime"
              @input="handleTimeInput($event, 'workTime')"
              class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
            />
          </div>
          <div>
            <label for="pause-time" class="block mb-2 text-sm font-medium text-white">Temps de pause</label>
            <input
              type="time"
              id="pause-time"
              :value="pauseTime"
              @input="handleTimeInput($event, 'pauseTime')"
              class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
            />
          </div>
        </div>
      </div>

      <!-- Style du Timer -->
      <div class="mb-4">
        <h3 class="text-lg font-medium text-white mb-3">Style du timer</h3>
        <select
          v-model="themeStore.timerStyle"
          class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option value="digital">Digital</option>
          <option value="clock">Horloge</option>
        </select>
      </div>

      <!-- Toggle et sélection du thème -->
      <div class="mb-4">
        <h3 class="text-lg font-medium text-white mb-3">Thème</h3>
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm text-white">{{ themeStore.showCustomTheme ? 'Thème personnalisé' : 'Thème prédéfini' }}</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              :checked="themeStore.showCustomTheme"
              @change="themeStore.toggleThemeMode"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all">
            </div>
          </label>
        </div>

        <!-- Thèmes prédéfinis -->
        <div v-if="!themeStore.showCustomTheme" class="space-y-4">
          <select
            v-model="themeStore.currentTheme"
            class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
            @change="themeStore.setTheme(themeStore.currentTheme)"
          >
            <option v-for="(theme, key) in themeStore.predefinedThemes" 
                    :key="key" 
                    :value="key">{{ theme.name }}</option>
          </select>
        </div>

        <!-- Options de thème personnalisé -->
        <div v-else class="space-y-2">
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-sm font-medium text-white">Couleurs</h4>
            <button 
              @click="resetTheme"
              class="text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded"
            >
              Réinitialiser
            </button>
          </div>
          
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label for="primaryColor" class="block text-xs text-white">Principale</label>
              <input
                type="color"
                id="primaryColor"
                v-model="localCustomTheme.primaryColor"
                class="h-8 w-full rounded-lg cursor-pointer"
                @change="updateTheme"
              />
            </div>
            <div>
              <label for="secondaryColor" class="block text-xs text-white">Secondaire</label>
              <input
                type="color"
                id="secondaryColor"
                v-model="localCustomTheme.secondaryColor"
                class="h-8 w-full rounded-lg cursor-pointer"
                @change="updateTheme"
              />
            </div>
            <div>
              <label for="accentColor" class="block text-xs text-white">Accent</label>
              <input
                type="color"
                id="accentColor"
                v-model="localCustomTheme.accentColor"
                class="h-8 w-full rounded-lg cursor-pointer"
                @change="updateTheme"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs text-white mb-1">Son d'alarme</label>
            <div class="flex gap-2">
              <select 
                v-model="localCustomTheme.alarmSound"
                class="bg-gray-700 text-white p-1.5 rounded flex-grow text-sm"
                @change="updateTheme"
              >
                <option value="">Aucun son</option>
                <option v-for="sound in alarmSounds" :key="sound.path" :value="sound.path">
                  {{ sound.name }}
                </option>
              </select>
              <button 
                @click="previewSound(localCustomTheme.alarmSound)"
                class="bg-accent text-white px-3 py-1.5 rounded text-sm"
                :disabled="!localCustomTheme.alarmSound"
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Options sonores -->
      <div class="mb-4">
        <h3 class="text-lg font-medium text-white mb-3">Son</h3>
        <div class="space-y-2">
          <div>
            <label for="soundVolume" class="block mb-2 text-sm text-white">Volume</label>
            <input
              type="range"
              id="soundVolume"
              :value="soundVolume"
              @input="$emit('update:soundVolume', parseInt($event.target.value))"
              min="0"
              max="100"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}
</style>