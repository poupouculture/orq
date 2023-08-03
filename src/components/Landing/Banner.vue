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

    <div class="grid md:grid-cols-2 gap-4 mx-4 my-5">
      <div class="col-span-1">
        <q-img
          class="rounded-borders"
          src="https://images.unsplash.com/photo-1688315031371-e216dad33add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
          style="height: 280px"
        />
      </div>

      <div class="col-span-1 flex flex-col">
        <h1 class="font-bold text-lg">Food Service</h1>

        <p class="">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          Reprehenderit quod tempore atque obcaecati asperiores, quis, odio
          delectus itaque ipsum enim, minus a. Dolorum mollitia necessitatibus
          quidem molestiae voluptate et quisquam!
        </p>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4 mx-4 my-5">
      <div class="col-span-1 flex flex-col">
        <h1 class="font-bold text-lg">Food Service</h1>

        <p class="">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          Reprehenderit quod tempore atque obcaecati asperiores, quis, odio
          delectus itaque ipsum enim, minus a. Dolorum mollitia necessitatibus
          quidem molestiae voluptate et quisquam!
        </p>
      </div>

      <div class="col-span-1">
        <q-img
          class="rounded-borders"
          src="https://images.unsplash.com/photo-1688315031371-e216dad33add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
          style="height: 280px"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
