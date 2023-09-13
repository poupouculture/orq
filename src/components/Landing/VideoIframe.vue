<script setup lang="ts">
import { computed } from "vue";
import { useQuasar } from "quasar";

import { VideoFrame } from "src/types/LandingPageTypes";

const props = defineProps<{
  unmute?: boolean;
  content?: VideoFrame;
}>();

const $q = useQuasar();

const videoId = computed(() => {
  return props.content?.raw !== null && props.content?.raw?.videoId !== null
    ? props.content?.raw?.videoId
    : "";
});
const style = computed(() => {
  return props.content?.raw !== null && props.content?.raw?.style !== null
    ? props.content?.raw?.style
    : "";
});

const iframeVideoSize = computed(() => {
  let frameSize = "";
  if (["xl", "lg", "md"].includes($q.screen.name)) {
    frameSize = "735";
  } else if ($q.screen.name === "xs") {
    frameSize = "250px";
  } else if ($q.screen.name === "sm") {
    frameSize = "450px";
  }

  return frameSize;
});
</script>
<template>
  <iframe
    width="100%"
    :height="iframeVideoSize"
    :src="`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${
      unmute ? '0' : '1'
    }&loop=1&playlist=${videoId}`"
    :style="style"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</template>
