<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed } from "vue";

const props = defineProps({
  content: {
    type: Object,
  },
});

const $q = useQuasar();

// const defaultStyle = ref({
//   padding: "20px",
// });

// const style = computed(() => {
//   return props.content?.raw !== null
//     ? props.content?.raw.style
//     : defaultStyle.value;
// });

const displayedContent = computed(
  () =>
    ($q.platform.is.mobile
      ? props.content?.content_mobile ?? props.content?.content
      : props.content?.content) ?? null
);
</script>

<template>
  <div>
    <article v-html="displayedContent" class="prose max-w-none" />
  </div>
</template>

<style scoped lang="scss"></style>
