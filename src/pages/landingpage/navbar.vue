<script setup lang="ts">
import logo from "assets/images/logo.svg";
// import menuIcon from "assets/images/menu.png";
</script>

<template>
  <div class="navbar flex justify-between">
    <div class="flex justify-center items-center gap-3">
      <img class="w-[50px]" :src="logo" alt="logo" />
      <p class="font-[800] text-white text-2xl">ChaQ</p>
    </div>
    <div class="flex items-center gap-5">
      <a
        href="#service"
        class="text-white text-lg font-bold"
        :class="{ hidden: $q.screen.lt.lg }"
      >
        Services
      </a>

      <a
        href="#contact"
        class="text-white text-lg font-bold"
        :class="{ hidden: $q.screen.lt.lg }"
      >
        Contact
      </a>

      <a
        href="#aboutus"
        class="text-white text-lg font-bold"
        :class="{ hidden: $q.screen.lt.lg }"
      >
        About Us
      </a>

      <button class="px-4 py-2 rounded-full bg-white/60 text-white">
        Get started
      </button>
      <!-- <q-btn class="text-black" size="md" round color="white">
        <img class="w-[20px]" :src="menuIcon" />
      </q-btn> -->
    </div>
  </div>
</template>

<style scoped></style>
