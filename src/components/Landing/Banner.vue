<script setup>
import Carousel from "./Carousel.vue";
import TextWithSideImage from "./TextWithSideImage.vue";
import TextWithBackground from "./TextWithBackground.vue";
import Icon from "./Icon.vue";
import Cover from "./Cover.vue";
import CarouselIcon from "./CarouselIcon.vue";
import Form from "./Form.vue";
import TextWithImageAbove from "./TextWithImageAbove.vue";

const props = defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <div v-if="props.content" class="flex flex-col">
    <div
      v-for="(data, index) in props.content.content"
      class="row relative w-full"
      :key="index"
    >
      <div v-if="data.type === 'carousel'" class="w-full mb-3 mx-7">
        <Carousel :content="data" />
      </div>

      <Cover
        v-else-if="data.type === 'cover_photo'"
        :content="data"
        :style="data.raw !== null ? data.raw.style : ''"
      >
        <div class="w-full">
          <div
            class="flex flex-col items-center justify-center font-['Inter'] capitalize text-[30px] gap-3 lg:gap-0 lg:text-[70px] font-black text-white"
          >
            <p class="text-center">
              {{ data.name }}
            </p>
          </div>
        </div>
      </Cover>

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

      <Form v-else-if="data.type === 'form'" :content="data" />
    </div>
  </div>
</template>
