<script setup>
import Navbar from "./navbar.vue";
import logo from "assets/images/logo.svg";
import Hero from "./hero.vue";
import Section1 from "./section1.vue";
import Section2 from "./section2.vue";
import Section3 from "./section3.vue";
import Section4 from "./section4.vue";
import Section5 from "./section5.vue";
import Section6 from "./section6.vue";
</script>

<template>
  <div class="bg-white font-['Red_Hat_Display']">
    <div class="min-h-screen home flex flex-col items-center w-full p-10">
      <div class="container">
        <Navbar />

        <Hero />
      </div>
    </div>

    <div
      class="min-h-screen flex flex-col items-center w-full px-3 py-10 sm:p-10"
    >
      <div class="container">
        <Section1 id="" />

        <Section2 id="service" />

        <Section3 />

        <Section4 id="contact" />
        <Section5 />

        <Section6 id="aboutus" />
      </div>
    </div>

    <div class="w-full flex bg-[#4B44F6] justify-center">
      <div
        class="container flex flex-col gap-4 sm:flex-row items-center sm:justify-between py-6"
      >
        <div class="flex justify-center items-center gap-3">
          <img class="w-[40px]" :src="logo" alt="logo" />
          <p class="font-[800] text-white text-2xl">ChaQ</p>
        </div>

        <span class="text-white order-3 sm:order-2">
          Copyright {{ new Date().getFullYear() }} Synque.io
        </span>

        <div class="flex text-[#4B44F6] sm:order-3 justify-center gap-5">
          <div class="rounded-full flex items-center p-1 bg-white">
            <q-icon size="20px" name="fa-brands fa-facebook-f" />
          </div>

          <div class="rounded-full flex items-center p-1 bg-white">
            <q-icon size="20px" name="fa-brands fa-instagram" />
          </div>
        </div>
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
