<script setup>
import { ref } from "vue";

const props = defineProps({
  content: {
    type: Object,
  },
});

const slide = ref(1);
const onHover = ref(false);
</script>

<template>
  <div class="" v-if="props.content">
    <div class="mb-3 mx-5" v-if="props.content?.children.length > 0">
      <q-carousel
        animated
        v-model="slide"
        navigation
        arrows
        :autoplay="onHover ? 0 : 3000"
        infinite
      >
        <q-carousel-slide
          draggable
          v-for="(carousel, index) in props.content?.children"
          :key="index"
          :name="index + 1"
          class="cursor-pointer"
          @mouseover="onHover = !onHover"
          :img-src="carousel.image"
        />
      </q-carousel>
    </div>

    <div class="flex flex-col gap-4">
      <div
        v-for="(data, index) in props.content.content"
        :key="index"
        class="grid md:grid-cols-2 gap-4 mx-4 my-5"
      >
        <div
          :class="data.alignment === 'left' ? 'order-1 lg:order-2' : 'order-1'"
          class="col-span-1"
        >
          <q-img
            class="rounded-borders"
            :src="data.image"
            style="height: 280px"
          />
        </div>

        <div
          :class="data.alignment === 'left' ? 'order-1' : 'order-2'"
          class="col-span-1 flex flex-col"
        >
          <p class="" v-html="data.content"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
