<script setup>
import { ref } from "vue";

const props = defineProps({
  content: {
    type: Object,
  },
});

const slide = ref(1);
const onHover = ref(false);

const carouselTimer = (dataRaw) => {
  if (onHover.value) {
    return 0;
  } else if (dataRaw !== null) {
    return dataRaw.time;
  } else {
    return 0;
  }
};
</script>

<template>
  <div class="" v-if="props.content">
    <div class="flex flex-col gap-4">
      <div
        class="row"
        v-for="(data, index) in props.content.content"
        :key="index"
      >
        <div v-if="data.type === 'carousel'" class="w-full mb-3 mx-5">
          <q-carousel
            animated
            v-model="slide"
            navigation
            arrows
            :autoplay="carouselTimer(data.raw)"
            infinite
          >
            <q-carousel-slide
              draggable
              v-for="(carousel, childrenIndex) in data.children"
              :key="childrenIndex"
              :name="childrenIndex + 1"
              class="cursor-pointer"
              @mouseover="onHover = !onHover"
              :img-src="carousel.image"
            />
          </q-carousel>
        </div>

        <div
          v-else-if="data.type === 'text_with_side_images'"
          class="grid md:grid-cols-2 gap-4 mx-4 my-5 w-full"
        >
          <div
            :class="
              data.alignment === 'left' ? 'order-1 lg:order-2' : 'order-1'
            "
            class="col-span-1"
          >
            <q-img
              class="rounded-borders"
              :src="data.image"
              style="min-height: 280px"
            />
          </div>

          <div
            :class="data.alignment === 'left' ? 'order-1' : 'order-2'"
            class="col-span-1 flex flex-col"
          >
            <article v-html="data.content" class="prose" />
          </div>
        </div>

        <div v-else-if="data.type === 'text_with_background'" class="w-full">
          <div
            :class="
              data.alignment === 'right' ? 'justify-end' : 'justify-start'
            "
            class="min-h-[500px] p-6 bg-center flex bg-cover"
            :style="{ backgroundImage: `url(${data.image})` }"
          >
            <div class="md:w-1/2 w-full">
              <article v-html="data.content" class="prose" />
            </div>
          </div>

          <div v-if="data.raw !== null" class="w-full">
            <iframe
              width="951"
              height="535"
              :src="`https://www.youtube.com/embed/${data.raw.videoId}${
                data.raw.autoplay ? '?autoplay=1&mute=1' : ''
              }`"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
