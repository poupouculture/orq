<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed } from "vue";
import { useRoute } from "vue-router";
import type { CSSProperties } from "vue";
import { Cover } from "src/types/LandingPageTypes";

const props = defineProps<{
  content?: any | Cover;
}>();

const route = useRoute();
const $q = useQuasar();
const contentStyle = computed(() => {
  return props.content?.raw && props.content?.raw.contentStyle
    ? props.content?.raw.contentStyle
    : {};
});

const conditionalStyle = (content: Cover) => {
  let obj: CSSProperties = {};
  if (Object.keys(content).length === 0) {
    return "";
  } else {
    obj.backgroundImage = `url(${content.image})`;
  }

  if (content.raw !== null && content.raw.style !== null) {
    const style = $q.platform.is.mobile
      ? { ...content.raw.styleMobile }
      : { ...content.raw.style };
    obj = {
      ...obj,
      ...style,
    };
  } else {
    obj = {
      ...obj,
      minHeight: "100vh",
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
    class="bg-center flex flex-col items-center w-full p-5 lg:p-10"
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
        <div class="container h-full">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
