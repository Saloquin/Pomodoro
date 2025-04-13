<script setup>
import { defineProps, computed } from 'vue';

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

const timeValues = computed(() => {
  const [minutes, seconds] = props.timer.split(':').map(Number);
  const totalSeconds = minutes * 60 + seconds;
  const totalMinutes = minutes + seconds / 60;
  
  // Calcul des angles pour les aiguilles
  const minutesDegrees = (totalMinutes / 60) * 360;
  const secondsDegrees = (totalSeconds % 60) / 60 * 360;

  return {
    minutes: minutesDegrees,
    seconds: secondsDegrees
  };
});
</script>

<template>
  <div class="clock-container mt-10 w-80 h-80 relative flex justify-center items-center">
    <div class="clock-face w-48 h-48 border-4 border-white rounded-full relative">
      <!-- Marques des heures -->
      <div v-for="n in 12" :key="n" class="hour-marker"
           :style="{ transform: `rotate(${n * 30}deg)` }">
        <div class="marker"></div>
      </div>
      
      <!-- Aiguille des minutes -->
      <div class="hand minute-hand"
           :style="{ transform: `rotate(${timeValues.minutes}deg)` }"></div>
      
      <!-- Aiguille des secondes -->
      <div class="hand second-hand"
           :style="{ transform: `rotate(${timeValues.seconds}deg)` }"></div>
      
      <!-- Point central -->
      <div class="center-point"></div>
    </div>
  </div>
</template>

<style scoped>
.clock-container {
  background-color: transparent;
}

.clock-face {
  background-color: rgba(0, 0, 0, 0.2);
}

.hour-marker {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.marker {
  position: absolute;
  width: 2px;
  height: 8px;
  background: white;
  left: 50%;
  top: 4px;
  transform: translateX(-50%);
}

.hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom;
  background: white;
}

.minute-hand {
  width: 3px;
  height: 35%;
  border-radius: 2px;
}

.second-hand {
  width: 2px;
  height: 40%;
  background: #facc15;
  border-radius: 1px;
}

.center-point {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #facc15;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>