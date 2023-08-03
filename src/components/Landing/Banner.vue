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
    <div class="mb-3" v-if="props.content?.children.length > 0">
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

    <div
      class="flex gap-4 flex-col mx-4"
      v-for="(data, index) in props.content.content"
      :key="index"
    >
      <q-img
        class="rounded-borders"
        :src="data.icon"
        style="height: 180px; max-width: 150px"
      />
      <h1 class="font-bold" v-if="data.name !== null">
        {{ data.name }}
      </h1>
      <p
        class="text-justify"
        v-if="data.content !== null"
        v-html="data.content"
      />
    </div>
  </div>
</template>

<style scoped></style>
