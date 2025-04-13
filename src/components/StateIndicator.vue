<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  isWorking: {
    type: Boolean,
    required: true
  }
});
</script>

<template>
  <div class="bg-secondary flex flex-row gap-6 border border-1 border-black rounded-xl p-3 px-8 mt-14 text-sm ombre">
    <p :class="isWorking ? 'text-accent' : 'text-white'">Travail</p>
    <p :class="!isWorking ? 'text-accent' : 'text-white'">Pause</p>
  </div>
</template>

<style scoped>
.ombre {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}
</style>