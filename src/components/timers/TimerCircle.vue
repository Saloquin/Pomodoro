<script setup>
import { defineProps } from 'vue';

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
</script>

<template>
  <div class=" mt-36 w-40 h-20 relative flex justify-center items-center rounded-xl">
    <p class="absolute text-5xl ">{{ timer }}</p>
  </div>
</template>

<style scoped>
.ombre {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}
</style>