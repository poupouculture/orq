<script setup lang="ts">
import { computed, ref } from "vue";
import { IContent, IRaw } from "src/types/LandingPageTypes";

defineProps<{
  content: IContent;
}>();

const slide = ref(1);
const onHover = ref(false);
const isMobile = computed(() => {
  return window.innerWidth < 1024;
});

const carouselTimer = (dataRaw: IRaw) => {
  if (onHover.value) {
    return 0;
  } else if (dataRaw !== null) {
    return dataRaw.time;
  } else {
    return 0;
  }
};
const iconAlignment = (alignment: string) => {
  if (alignment === "center") {
    return "md:justify-center md:items-center";
  } else if (alignment === "left") {
    return "md:justify-start md:items-start";
  } else if (alignment === "around") {
    return "md:justify-around md:items-center";
  } else if (alignment === "right") {
    return "md:justify-end md:items-end";
  } else {
    return "md:justify-evenly md:items-center";
  }
};
</script>

<template>
  <q-carousel
    animated
    v-model="slide"
    arrows
    :autoplay="carouselTimer(content.raw)"
    infinite
    class="relative"
  >
    <q-carousel-slide
      draggable
      v-for="(carousel, childrenIndex) in content.children.filter((item: any) => item.type === 'carousel_background_overlay')"
      :key="childrenIndex"
      :name="childrenIndex + 1"
      class="cursor-pointer"
      @mouseover="onHover = !onHover"
    >
      <div class="h-full">
        <q-img
          v-if="carousel.type === 'carousel_background_overlay'"
          no-spinner
          style="height: 100%"
          :src="carousel.image"
        />
        <div
          class="text-white flex justify-center items-center absolute inset-0 w-full h-full"
          :style="{ ...content?.raw.overlay }"
        ></div>
        <div
          class="flex absolute inset-0 w-full h-full flex-col justify-center items-center md:flex-row gap-y-3"
          :class="iconAlignment(content.raw.icon)"
        >
          <div
            v-for="(icon, i) in content.children.filter((item: any) => item.type === 'icon_with_background')"
            :key="i"
            class="flex text-white flex-col items-center font-bold"
            :style="[isMobile ? icon.raw.styleMobile : icon.raw.style]"
          >
            <p class="text-lg lg:text-2xl">
              {{ icon.raw?.content?.title || "" }}
            </p>
            <p class="text-xl lg:text-3xl uppercase">
              {{ icon.raw?.content?.description || "" }}
            </p>
            <img
              :src="icon.image"
              :style="[
                isMobile ? icon.raw.imageStyleMobile : icon.raw.imageStyle,
              ]"
            />
          </div>
        </div>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<style scoped lang="scss">
.q-carousel__slide,
.q-carousel .q-carousel--padding {
  padding: 0;
}
</style>
