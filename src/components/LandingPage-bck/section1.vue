<script setup lang="ts">
import DashboardSide from "src/assets/images/dashboardImage.png";
import VectorLiquid from "src/assets/images/vectorLiquid.png";
</script>

<template>
  <div class="mt-20 grid grid-cols-1 relative lg:grid-cols-2 items-center">
    <img :src="VectorLiquid" class="absolute -left-[69px] w-20" />

    <div class="flex pl-5 flex-col items-start">
      <p
        class="text-black text-4xl md:text-[40px] font-black md:w-[602px] leading-[50px] lg:leading-[57px]"
      >
        Dashboard, for all business transactions
      </p>

      <span class="mt-3 text-[#5C5A8F]">
        From orders to real-time cash in your bank. Run your business like a
        rockstar.
      </span>
    </div>

    <div class="">
      <img :src="DashboardSide" class="rounded-lg" alt="" />
    </div>
  </div>
</template>

<style scoped></style>
