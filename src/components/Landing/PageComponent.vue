<script setup>
import Carousel from "./Carousel.vue";
import TextWithSideImage from "./TextWithSideImage.vue";
import TextWithBackground from "./TextWithBackground.vue";
import Wysiwyg from "./Wysiwyg.vue";
import Icon from "./Icon.vue";
import Cover from "./Cover.vue";
import CarouselIcon from "./CarouselIcon.vue";
import Form from "./Form.vue";
import VideoIframe from "src/components/Landing/VideoIframe.vue";
import TextWithImageAbove from "./TextWithImageAbove.vue";
import BackgroundWithIcon from "./Carousel/BackgroundWithIcon.vue";

const props = defineProps({
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
  <div v-if="props.content" class="flex flex-col">
    <div
      v-for="(data, index) in props.content.content"
      class="row relative w-full"
      :key="index"
    >
      <div v-if="data.type === 'carousel'" class="w-full mb-3 mx-7">
        <Carousel :content="data" />
      </div>

      <Cover v-else-if="data.type === 'cover_photo'" :content="data">
        <div class="w-full">
          <div
            class="flex capitalize gap-3 lg:gap-0"
            :class="flexDirection(data.alignment)"
          >
            <article
              v-html="data.content_mobile"
              class="prose !block md:!hidden"
            ></article>

            <article
              v-html="data.content"
              class="prose !hidden md:!block"
            ></article>
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
      <div
        v-else-if="data.type === 'carousel_background_overlay'"
        class="w-full"
      >
        <BackgroundWithIcon :content="data" />
      </div>

      <Form v-else-if="data.type === 'form'" :content="data" />

      <Wysiwyg v-else-if="data.type === 'wysiwyg'" :content="data" />

      <VideoIframe v-else-if="data.type === 'iframe_media'" :content="data" />
    </div>
  </div>
</template>
