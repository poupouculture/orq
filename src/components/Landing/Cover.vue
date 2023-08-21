<script setup>
import { useRoute } from "vue-router";

defineProps({
  content: {
    type: Object,
  },
});

const route = useRoute();

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
    class="bg-center min-h-screen flex flex-col items-center w-full p-5 lg:p-10"
    style="background-position: center; background-size: cover"
    :style="conditionalStyle(content)"
  >
    <div class="container mt-6">
      <div
        :class="
          route.name == 'landingpage' && $q.screen.gt.md
            ? 'min-h-[90vh] '
            : ' min-h-screen'
        "
        class="w-full flex flex-col mt-7 lg:px-20 justify-center items-start"
      >
        <div class="container mt-6">
          <slot />
        </div>
        <div class="flex w-full mt-24 justify-center">
          <!-- <button
            @click="scrollDown"
            class="rounded-full p-2 border-dashed border-2"
          >
            <q-icon class="text-white" name="arrow_downward" size="4rem" />
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
