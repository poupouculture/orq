<script setup>
import { Vue3Marquee } from "vue3-marquee";

defineProps({
  content: {
    type: Object,
  },
});

const flexDirection = (alignment) => {
  if (alignment === "center") {
    return "justify-center";
  } else if (alignment === "left") {
    return "justify-start";
  } else if (alignment === "right") {
    return "justify-end";
  }
};
</script>

<template>
  <div class="w-full py-8">
    <div class="w-full flex justify-center">
      <article v-html="content.content" class="prose"></article>
    </div>

    <template v-if="content?.raw !== null">
      <div
        v-if="content?.raw.style === 'grid'"
        class="w-full flex"
        :class="flexDirection(content.alignment)"
      >
        <div class="flex justify-center">
          <div class="flex flex-wrap justify-center">
            <div
              class="flex items-center"
              v-for="(img, i) in content.children"
              :key="i"
            >
              <img
                :src="img.icon"
                width="150"
                height="150"
                class="object-cover mx-6"
              />
            </div>
          </div>
        </div>
      </div>

      <Vue3Marquee
        v-if="content?.raw.style === 'carousel'"
        v-bind="content?.raw.props"
        :duration="
          content?.raw.props.duration ? content?.raw.props.duration : 5
        "
        direction="reverse"
      >
        <img
          v-for="(img, i) in content.children"
          :key="i"
          :src="img.icon"
          width="150"
          height="150"
          class="object-cover mx-6"
        />
      </Vue3Marquee>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
