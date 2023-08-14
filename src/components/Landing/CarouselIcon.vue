<script setup>
import { Vue3Marquee } from "vue3-marquee";

defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <Vue3Marquee direction="reverse" :duration="5">
    <img
      v-for="(img, i) in content.children"
      :key="i"
      :src="img.icon"
      class="w-32 h-32 object-cover mx-6"
    />
  </Vue3Marquee>
  <div class=""></div>
</template>

<style scoped lang="scss"></style>
