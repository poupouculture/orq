<script setup>
import Hero from "src/components/Landing/Hero.vue";
import PageComponent from "src/components/Landing/PageComponent.vue";
import { storeToRefs } from "pinia";

import useLandingPage from "src/stores/modules/landingpage";

const landingPageStore = useLandingPage();
const { getComponent } = storeToRefs(landingPageStore);
</script>

<template>
  <Hero class="justify-center">
    <div class="w-full">
      <div
        class="flex flex-col items-center justify-center font-['Inter'] capitalize text-[55px] gap-3 lg:gap-0 lg:text-[70px] font-black text-white"
      >
        <p class="text-center">
          {{ getComponent.heroText }}
        </p>
      </div>
    </div>
  </Hero>

  <div class="w-full flex justify-center flex-col min-h-screen items-center">
    <div class="w-full container my-5">
      <PageComponent :content="getComponent" />
    </div>
    <!-- <div class="container grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      About us
    </div> -->
  </div>
</template>

<style scoped></style>
