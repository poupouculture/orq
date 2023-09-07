<script setup>
import Hero from "src/components/Landing/Hero.vue";
import PageComponent from "src/components/Landing/PageComponent.vue";
import { storeToRefs } from "pinia";
import useLandingPage from "src/stores/modules/landingpage";
import WhatsAppOverlay from "src/components/Landing/Partials/WhatsAppOverlay.vue";

const landingPageStore = useLandingPage();
const { getComponent } = storeToRefs(landingPageStore);
</script>

<template>
  <div>
    <Hero v-if="getComponent.heroText" class="justify-center">
      <div class="w-full">
        <div
          class="flex flex-col items-center justify-center font-['Inter'] capitalize text-[30px] gap-3 lg:gap-0 lg:text-[70px] font-black text-white"
        >
          <p class="text-center">
            {{ getComponent.heroText }}
          </p>
        </div>
      </div>
    </Hero>
    <div class="w-full flex flex-col items-center min-h-screen">
      <div class="w-full">
        <PageComponent :content="getComponent" />
      </div>
    </div>
    <WhatsAppOverlay />
  </div>
</template>

<style scoped></style>
