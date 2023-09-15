<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed } from "vue";
import { Vue3Marquee } from "vue3-marquee";
import { Carousel, Alignment } from "src/types/LandingPageTypes";

const $q = useQuasar();

const props = defineProps<{
  content?: Carousel;
}>();

const flexDirection = (alignment?: Alignment) => {
  if (alignment === Alignment.CENTER) {
    return "justify-center";
  } else if (alignment === Alignment.LEFT) {
    return "justify-start";
  } else if (alignment === Alignment.RIGHT) {
    return "justify-end";
  }
};

const contentStyle = computed(() => {
  return props.content?.raw && props.content?.raw.contentStyle
    ? props.content.raw.contentStyle
    : {
        padding: "10px",
      };
});

const wrapperStyle = computed(() => {
  return props.content?.raw && props.content?.raw.wrapperStyle
    ? props.content.raw.wrapperStyle
    : {
        padding: "10px",
      };
});

const duration = computed(() => {
  return props.content?.raw && props.content?.raw.props.duration
    ? props.content?.raw.props.duration
    : 5;
});

const iconSize = computed(() => {
  return props.content?.raw && props.content?.raw.iconSize
    ? props.content?.raw.iconSize
    : {
        width: "150",
        height: "150",
      };
});

const iconAligment = computed(() => {
  return props.content?.raw && props.content?.raw.iconAligment
    ? props.content?.raw.iconAligment
    : props.content?.alignment;
});

const displayedContent = computed(() =>
  $q.platform.is.mobile
    ? props.content?.content_mobile ?? props.content?.content
    : props.content?.content
);
</script>

<template>
  <div class="w-full" :style="wrapperStyle">
    <div
      class="w-full flex"
      :class="flexDirection(content?.alignment)"
      :style="contentStyle"
    >
      <article v-html="displayedContent" class="prose"></article>
    </div>

    <template v-if="content?.raw !== null">
      <div
        v-if="content?.raw.style === 'grid'"
        class="w-full flex"
        :class="flexDirection(iconAligment)"
      >
        <div class="flex justify-center">
          <div class="flex flex-wrap justify-center">
            <div
              class="flex h-full w-full items-center"
              v-for="(img, i) in content.children"
              :key="i"
            >
              <img :src="img.icon" v-bind="iconSize" class="object-cover" />
            </div>
          </div>
        </div>
      </div>

      <Vue3Marquee
        :clone="true"
        v-if="content?.raw.style === 'carousel'"
        :duration="duration"
        direction="reverse"
      >
        <div
          class="h-full w-full flex items-center"
          v-for="(img, i) in content.children"
          :key="i"
        >
          <img
            :src="img.icon"
            v-bind="iconSize"
            class="h-auto w-auto object-cover"
          />
        </div>
      </Vue3Marquee>
    </template>

    <Vue3Marquee v-else :clone="true" :duration="duration" direction="reverse">
      <div
        class="h-full w-full flex items-center"
        v-for="(img, i) in content.children"
        :key="i"
      >
        <img :src="img.icon" v-bind="iconSize" class="h-auto w-auto" />
      </div>
    </Vue3Marquee>
  </div>
</template>

<style scoped lang="scss"></style>
