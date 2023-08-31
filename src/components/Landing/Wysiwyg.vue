<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed } from "vue";

const props = defineProps({
  content: {
    type: Object,
  },
});

const $q = useQuasar();

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

<style scoped lang="scss">
@media (max-width: $breakpoint-xs-max) {
  #wrapper-wysiwyg {
    padding: 0 !important;
  }
}
</style>
