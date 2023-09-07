<script setup lang="ts">
import { computed } from "vue";

import { VideoFrame } from "src/types/LandingPageTypes";

const props = defineProps<{
  unmute?: boolean;
  content?: VideoFrame;
}>();

const videoId = computed(() => {
  return props.content?.raw !== null && props.content?.raw?.videoId !== null
    ? props.content?.raw?.videoId
    : "";
});
</script>
<template>
  <iframe
    width="100%"
    height="735"
    :src="`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${
      unmute ? '0' : '1'
    }&loop=1&playlist=${videoId}`"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</template>
