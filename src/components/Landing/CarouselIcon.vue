<script setup>
import { Vue3Marquee } from "vue3-marquee";

defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <Vue3Marquee direction="reverse" :duration="12">
    <img
      v-for="(img, i) in content.children"
      :key="i"
      :src="img.icon"
      class="object-cover mx-6 max-h-32 w-full rounded-lg"
    />
  </Vue3Marquee>
  <div class=""></div>
</template>

<style scoped lang="scss"></style>
