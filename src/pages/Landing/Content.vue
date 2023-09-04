<script setup>
import Hero from "src/components/Landing/Hero.vue";
import Banner from "src/components/Landing/Banner.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import useLandingPage from "src/stores/modules/landingpage";
import WhatsAppOverlay from "src/components/Partials/WhatsAppOverlay.vue";

const landingPageStore = useLandingPage();
const { getComponent, topNavigation } = storeToRefs(landingPageStore);

const scroll = ref(false);

const onScroll = (event) => {
  if (topNavigation.value[0].header_position === "fixed") {
    if (event === 0) {
      scroll.value = false;
    } else scroll.value = true;
  }
};
</script>

<template>
  <div v-scroll="onScroll">
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
    <div
      class="w-full flex flex-col items-center"
      :class="scroll ? 'h-full' : 'min-h-screen'"
    >
      <div class="w-full">
        <Banner :content="getComponent" />
      </div>
    </div>
    <WhatsAppOverlay />
  </div>
</template>

<style scoped></style>
