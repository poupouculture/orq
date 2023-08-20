<script setup lang="ts">
import { computed, ref } from "vue";
import { IContent, IRawBackgroundWithIcon } from "src/types/LandingPageTypes";
import { iconAlignment } from "src/helpers/LandingPageHelper";

defineProps<{
  content: IContent;
}>();

const slide = ref(1);
const isMobile = computed(() => {
  return window.innerWidth < 1024;
});

const carouselTimer = (dataRaw: IRawBackgroundWithIcon) => {
  if (dataRaw !== null) {
    return dataRaw.autoplay || false;
  } else {
    return 0;
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
          class="flex absolute inset-0 w-full h-full flex-col justify-center items-center md:flex-row gap-y-5"
          :class="[
            content.raw?.icon?.alignment
              ? iconAlignment(content.raw.icon.alignment)
              : 'md:justify-evenly',
          ]"
        >
          <div
            v-for="(icon, i) in content.children.filter((item: any) => item.type === 'icon_with_background')"
            :key="i"
            class="flex text-white flex-col items-center font-bold"
            :style="[isMobile ? icon.raw.styleMobile : icon.raw.style]"
          >
            <p class="text lg:text-2xl">
              {{ icon.raw?.content?.title || "" }}
            </p>
            <p class="text lg:text-3xl uppercase">
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
