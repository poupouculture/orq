<script setup>
import Carousel from "./Carousel.vue";
import TextWithSideImage from "./TextWithSideImage.vue";
import TextWithBackground from "./TextWithBackground.vue";
import Icon from "./Icon.vue";
import CarouselIcon from "./CarouselIcon.vue";
import TextWithImageAbove from "./TextWithImageAbove.vue";

const props = defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <div v-if="props.content" class="flex flex-col gap-4">
    <div
      class="row relative min-h-[500px]"
      v-for="(data, index) in props.content.content"
      :key="index"
    >
      <div v-if="data.type === 'carousel'" class="w-full mb-3 mx-7">
        <Carousel :content="data" />
      </div>

      <TextWithSideImage
        v-else-if="data.type === 'text_with_side_images'"
        :content="data"
      />

      <TextWithBackground
        v-else-if="data.type === 'text_with_background'"
        :content="data"
      />

      <Icon v-else-if="data.type === 'icon'" :content="data" />

      <CarouselIcon v-else-if="data.type === 'carousel_icon'" :content="data" />

      <TextWithImageAbove
        v-else-if="data.type === 'text_above_image'"
        :content="data"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
