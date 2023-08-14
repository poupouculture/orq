<script setup>
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import useLandingPage from "src/stores/modules/landingpage";

const landingPageStore = useLandingPage();
const { getComponent } = storeToRefs(landingPageStore);

const route = useRoute();

const scrollDown = () => {
  window.scrollTo(0, 500);
};
</script>

<template>
  <div
    :class="
      Object.keys(getComponent).length === 0 && route.name == 'landingpage'
        ? 'min-h-screen homeHero'
        : route.name !== 'landingpage'
        ? 'lg:h-[70vh] homeHero'
        : 'lg:h-[70vh]'
    "
    :style="
      Object.keys(getComponent).length === 0
        ? ''
        : { backgroundImage: `url(${getComponent.iconCover})` }
    "
    class="bg-center flex flex-col items-center w-full p-5 lg:p-10"
    style="background-position: center; background-size: cover"
  >
    <div class="container mt-6">
      <div
        :class="
          route.name == 'landingpage' && $q.screen.gt.md
            ? 'min-h-[90vh] '
            : ' min-h-screen'
        "
        class="w-full flex flex-col mt-7 lg:px-20 justify-center items-start"
      >
        <div class="container mt-6">
          <slot />
        </div>
        <div class="flex w-full mt-24 justify-center">
          <button
            @click="scrollDown"
            class="rounded-full p-2 border-dashed border-2"
          >
            <q-icon class="text-white" name="arrow_downward" size="4rem" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="w-full relative bg-red-500 h-screen z-20">

<iframe
  width="100%"
  height="760"
  src="https://www.youtube.com/embed/qIQ3xNqkVC4?autoplay=1&mute=1&loop&playlist=qIQ3xNqkVC4"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
/>

<div class="w-full">
  <div
    :style="{
      background: `linear-gradient(10deg, rgb(17, 90, 171) 0%, rgba(113, 20, 20, 0) 100%)`,
    }"
    class="text-white flex justify-center items-center absolute top-0 bottom-0 w-full"
  >
    <div

      class="w-full relative justify-center items-center flex flex-col mx-5 gap-4"
    >
      <h1

        class="mb-0 text-white text-3xl lg:text-6xl text-capitalize font-bold"
      >
        Spiderman 2
      </h1>

      <span  class="text-xl">
        2024
      </span>

      <q-btn
        tag="a"
        target="_blank"
        :href="`https://www.youtube.com/embed/qIQ3xNqkVC4`"
        unelevated
        rounded
        color="primary"
        label="See Video"
      />

      <div class="absolute right-10 -bottom-64">
        <q-icon
          class="cursor-pointer"
          size="sm"
          :name="unmute ? 'volume_up' : 'volume_off'"
        />
      </div>
    </div>
  </div>
</div>
</div> -->
</template>

<style scoped></style>
