<script setup>
import Hero from "src/components/Landing/Hero.vue";
import Section1 from "src/components/Landing/section1.vue";
import Section2 from "src/components/Landing/section2.vue";
import Section3 from "src/components/Landing/section3.vue";
import Section4 from "src/components/Landing/section4.vue";
import Section5 from "src/components/Landing/section5.vue";
import Section6 from "src/components/Landing/section6.vue";
</script>

<template>
  <div>
    <Hero>
      <div class="w-100 sm:pl-36 lg:pl-36">
        <div
          class="flex flex-col font-['Inter'] capitalize text-[55px] gap-3 lg:gap-0 lg:text-[70px] font-black text-white"
        >
          <p class="">Let Technology</p>
          <p>Handle the</p>
          <p>Heavy</p>
          <p>Lifting</p>
        </div>

        <div
          class="flex flex-col mt-5 gap-5 font-['Red_Hat_Display'] text-white text-lg font-normal w-4/5"
        >
          <span class="">
            Streamline your workflow with our web app that includes messaging.
          </span>

          <span class="">
            Our goal is to provide a seamless and intuitive experience that
            simplifies your business operations and builds strategic value for
            your brand, whether you're in e-commerce, healthcare, or any other
            industry.
          </span>
        </div>
      </div>
    </Hero>

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
  </div>
</template>

<style scoped></style>
