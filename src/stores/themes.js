import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useThemeStore = defineStore('themes', () => {
  // Charger les données sauvegardées ou utiliser les valeurs par défaut
  const savedState = JSON.parse(localStorage.getItem('themeStore')) || {};
  
  const currentTheme = ref(savedState.currentTheme || 'custom');
  const timerStyle = ref(savedState.timerStyle || 'digital');
  const showCustomTheme = ref(savedState.showCustomTheme ?? true);
  
  const customTheme = ref({
    primaryColor: savedState.customTheme?.primaryColor || '#EF4444',
    secondaryColor: savedState.customTheme?.secondaryColor || '#0e7490',
    accentColor: savedState.customTheme?.accentColor || '#facc15',
    backgroundImage: savedState.customTheme?.backgroundImage || null,
    alarmSound: savedState.customTheme?.alarmSound || '/sound/alarm/phoneBell.mp3',
    gifs: savedState.customTheme?.gifs || []
  });

  const predefinedThemes = {
    nature: {
      name: 'Nature',
      primaryColor: '#4CAF50',
      secondaryColor: '#1B5E20',
      accentColor: '#FFEB3B',
      backgroundImage: null,
      alarmSound: '/sound/alarm/firecamp.mp3',
      gifs: []
    },
    ocean: {
      name: 'Océan',
      primaryColor: '#4FC3F7',
      secondaryColor: '#0D47A1',
      accentColor: '#FFF176',
      backgroundImage: null,
      alarmSound: '/sound/alarm/chill.mp3',
      gifs: []
    },
    minimal: {
      name: 'Minimal',
      primaryColor: '#757575',
      secondaryColor: '#212121',
      accentColor: '#FFFFFF',
      backgroundImage: null,
      alarmSound: '/sound/alarm/notif.mp3',
      gifs: []
    },
    sunset: {
      name: 'Coucher de soleil',
      primaryColor: '#FF9800',
      secondaryColor: '#B71C1C',
      accentColor: '#FFEB3B',
      backgroundImage: null,
      alarmSound: '/sound/alarm/star.mp3',
      gifs: []
    },
    forest: {
      name: 'Forêt',
      primaryColor: '#81C784',
      secondaryColor: '#1B3D1B',
      accentColor: '#FFB74D',
      backgroundImage: null,
      alarmSound: '/sound/alarm/forest.mp3',
      gifs: []
    },
    purple: {
      name: 'Violet',
      primaryColor: '#BA68C8',
      secondaryColor: '#4A148C',
      accentColor: '#64FFDA',
      backgroundImage: null,
      alarmSound: '/sound/alarm/magic.mp3',
      gifs: []
    },
    midnight: {
      name: 'Minuit',
      primaryColor: '#5C6BC0',
      secondaryColor: '#1A237E',
      accentColor: '#90CAF9',
      backgroundImage: null,
      alarmSound: '/sound/alarm/galaxy.mp3',
      gifs: []
    },
    animalCrossing: {
      name: 'Animal Crossing',
      primaryColor: '#FFAB40',
      secondaryColor: '#4CAF50',
      accentColor: '#FFEB3B',
      backgroundImage: '/themes/acnh.png',
      alarmSound: '/sound/alarm/acnh.mp3',
      gifs: ['/gif/acnh.gif']
    },
    zelda: {
      name: 'Zelda',
      primaryColor: '#FF5722',
      secondaryColor: '#4CAF50',
      accentColor: '#FFEB3B',
      backgroundImage: '/themes/zelda.jpg',
      alarmSound: '/sound/alarm/zelda.mp3',
      gifs: ['/gif/link.gif', '/gif/korogu.gif']
    },
    undertale: {
      name: 'Undertale',
      primaryColor: '#FF4081',
      secondaryColor: '#3F51B5',
      accentColor: '#FFEB3B',
      backgroundImage: '/themes/undertale.png',
      alarmSound: '/sound/alarm/undertale.mp3',
      gifs: ['/gif/undertale.gif']
    },
  };

  const defaultTheme = {
    primaryColor: '#EF4444',
    secondaryColor: '#0e7490',
    accentColor: '#facc15',
    backgroundImage: null,
    alarmSound: '/sound/alarm/phoneBell.mp3',
    gifs: []
  };

  // Sauvegarder l'état dans le localStorage à chaque changement
  watch([currentTheme, timerStyle, showCustomTheme, customTheme], () => {
    localStorage.setItem('themeStore', JSON.stringify({
      currentTheme: currentTheme.value,
      timerStyle: timerStyle.value,
      showCustomTheme: showCustomTheme.value,
      customTheme: customTheme.value
    }));
  }, { deep: true });

  const toggleThemeMode = () => {
    showCustomTheme.value = !showCustomTheme.value;
    if (showCustomTheme.value) {
      setTheme('custom');
    } else {
      setTheme('minimal');
    }
  };

  const setTheme = (themeName) => {
    currentTheme.value = themeName;
    const themeToApply = showCustomTheme.value ? customTheme.value : predefinedThemes[themeName];
    
    if (themeToApply) {
      // Appliquer les couleurs directement sans inversion
      document.documentElement.style.setProperty('--primary', themeToApply.primaryColor);
      document.documentElement.style.setProperty('--secondary', themeToApply.secondaryColor);
      document.documentElement.style.setProperty('--accent', themeToApply.accentColor);
      
      if (themeToApply.backgroundImage) {
        document.body.style.backgroundImage = `url(${themeToApply.backgroundImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
      } else {
        document.body.style.backgroundImage = 'none';
      }

      currentAlarmSound.value = themeToApply.alarmSound;
    }
  };

  const updateCustomTheme = (newTheme) => {
    Object.assign(customTheme.value, newTheme);
    if (showCustomTheme.value) {
      setTheme('custom');
    }
  };

  const resetCustomTheme = () => {
    Object.assign(customTheme.value, defaultTheme);
    if (showCustomTheme.value) {
      setTheme('custom');
    }
  };

  const currentAlarmSound = ref(null);

  const activeTheme = computed(() => {
    return showCustomTheme.value ? customTheme.value : predefinedThemes[currentTheme.value];
  });

  return {
    currentTheme,
    customTheme,
    predefinedThemes,
    timerStyle,
    showCustomTheme,
    setTheme,
    updateCustomTheme,
    toggleThemeMode,
    activeTheme,
    currentAlarmSound,
    resetCustomTheme
  };
});