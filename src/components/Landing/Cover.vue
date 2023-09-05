<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  content: {
    type: Object,
  },
});

const route = useRoute();

const contentStyle = computed(() => {
  return props.content?.raw && props.content?.raw.contentStyle
    ? props.content?.raw.contentStyle
    : {};
});

const conditionalStyle = (content) => {
  let obj = {};
  if (Object.keys(content).length === 0) {
    return "";
  } else {
    obj.backgroundImage = `url(${content.image})`;
  }

  if (content.raw !== null) {
    obj = {
      ...obj,
      ...content.raw.style,
    };
  }

  return obj;
};
</script>

<template>
  <div
    :class="
      Object.keys(content).length === 0 && route.name == 'landingpage'
        ? 'homeHero'
        : route.name !== 'landingpage'
        ? 'lg:h-[70vh] homeHero'
        : 'lg:h-[70vh]'
    "
    class="bg-center h-full flex flex-col items-center w-full p-5 lg:p-10"
    style="background-position: center; background-size: cover"
    :style="conditionalStyle(content)"
  >
    <div class="container h-full">
      <div
        :class="
          route.name == 'landingpage' && $q.screen.gt.md
            ? 'min-h-[90vh] '
            : 'h-full'
        "
        class="w-full flex flex-col justify-center items-start"
        :style="contentStyle"
      >
        <div class="container">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
