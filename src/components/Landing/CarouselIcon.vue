<script setup>
import { Vue3Marquee } from "vue3-marquee";

defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <Vue3Marquee
    direction="reverse"
    :duration="parseInt(content?.raw?.duration) || 10"
    :clone="true"
  >
    <div
      v-for="(img, i) in content.children"
      :key="i"
      :style="{ margin: content?.raw?.margin || '0 1.5rem' }"
    >
      <img
        :src="img.icon"
        class="object-cover w-full rounded-lg"
        :style="{ maxHeight: content?.raw?.maxHeight || '8rem' }"
      />
    </div>
  </Vue3Marquee>
  <div class=""></div>
</template>

<style scoped lang="scss"></style>
