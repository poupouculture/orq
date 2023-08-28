<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed, ref } from "vue";

const props = defineProps({
  content: {
    type: Object,
  },
});

const $q = useQuasar();

const displayedContent = computed(() =>
  $q.platform.is.mobile
    ? props.content?.content_mobile ?? props.content?.content_mobile
    : props.content?.content
);

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
  <div :style="style" id="wrapper-wysiwyg">
    <article v-html="displayedContent" class="prose max-w-none" />
  </div>
</template>

<style scoped lang="scss">
@media (max-width: $breakpoint-xs-max) {
  #wrapper-wysiwyg {
    padding: 0 !important;
  }
}
</style>
