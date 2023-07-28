<script setup>
import Hero from "src/components/LandingPage/hero.vue";
</script>

<template>
  <Hero class="justify-center">
    <div class="w-full">
      <div
        class="flex flex-col items-center justify-center font-['Inter'] capitalize text-[55px] gap-3 lg:gap-0 lg:text-[70px] font-black text-white"
      >
        <p class="text-center">About us</p>
      </div>
    </div>
  </Hero>

  <div class="w-full flex justify-center flex-col min-h-screen items-center">
    <div class="container grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      About us
    </div>
  </div>
</template>

<style scoped></style>
