<script setup>
import Carousel from "./Carousel.vue";
import TextWithSideImage from "./TextWithSideImage.vue";
import TextWithBackground from "./TextWithBackground.vue";
import Wysiwyg from "./Wysiwyg.vue";
import Icon from "./Icon.vue";
import Cover from "./Cover.vue";
import CarouselIcon from "./CarouselIcon.vue";
import Form from "./Form.vue";
import TextWithImageAbove from "./TextWithImageAbove.vue";
import BackgroundWithIcon from "./Carousel/BackgroundWithIcon.vue";
import { useQuasar } from "quasar";

const props = defineProps({
  content: {
    type: Object,
  },
});

const $q = useQuasar();

const displayedContent = (data) => {
  return $q.platform.is.mobile
    ? data?.content_mobile ?? data?.content_mobile
    : data?.content;
};

const flexDirection = (alignment) => {
  if (alignment === "center") {
    return "justify-center";
  } else if (alignment === "left") {
    return "justify-start";
  } else if (alignment === "right") {
    return "justify-end";
  } else if (alignment === "above") {
    return "justify-start items-start";
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
        <div class="w-full h-full">
          <div
            class="flex capitalize gap-3 lg:gap-0 h-full w-full"
            :class="flexDirection(data.alignment)"
          >
            <article
              v-html="displayedContent(data)"
              class="prose max-w-none prose-img:m-0"
            />
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
    </div>
  </div>
</template>
