<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  content: {
    type: Object,
  },
});

const defaultStyle = ref({
  padding: "20px",
});

const style = computed(() => {
  return props.content?.raw !== null
    ? props.content?.raw.style
    : defaultStyle.value;
});
</script>

<template>
  <div :style="style">
    <article v-html="props.content.content" class="prose max-w-none" />
  </div>
</template>

<style scoped lang="scss"></style>
