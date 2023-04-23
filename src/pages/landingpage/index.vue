<script setup>
import Navbar from "./navbar.vue";
import Hero from "./hero.vue";
import Section1 from "./section1.vue";
import Section2 from "./section2.vue";
import Section3 from "./section3.vue";
</script>

<template>
  <div class="bg-white">
    <div class="min-h-screen home flex flex-col items-center w-full p-10">
      <div class="container">
        <Navbar />

        <Hero />
      </div>
    </div>

    <div class="min-h-screen flex flex-col items-center w-full p-10">
      <div class="container">
        <Section1 />

        <Section2 />

        <Section3 />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  background: linear-gradient(200.56deg, #40a4ff -3.58%, #e12179 94.64%),
    #4b44f6;
}
</style>
