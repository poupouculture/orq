<script setup>
import { ref } from "vue";

defineProps({
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
  <q-carousel
    animated
    v-model="slide"
    navigation
    arrows
    :autoplay="carouselTimer(content.raw)"
    infinite
  >
    <q-carousel-slide
      draggable
      v-for="(carousel, childrenIndex) in content.children"
      :key="childrenIndex"
      :name="childrenIndex + 1"
      class="cursor-pointer"
      @mouseover="onHover = !onHover"
      :img-src="carousel.image"
    />
  </q-carousel>
</template>

<style scoped lang="scss"></style>
