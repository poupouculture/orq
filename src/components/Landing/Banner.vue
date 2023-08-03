<script setup>
import { ref } from "vue";

const props = defineProps({
  content: {
    type: Object,
  },
});

const slide = ref(1);
</script>

<template>
  <div class="mb-3" v-if="props.content?.children.length > 0">
    <q-carousel animated v-model="slide" arrows navigation infinite>
      <q-carousel-slide
        v-for="(carousel, index) in props.content?.children"
        :key="index"
        :name="index + 1"
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
    ></p>
  </div>
</template>

<style scoped></style>
