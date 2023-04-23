<script setup lang="ts">
import { ref } from "vue";
import dashboardAssigned from "src/assets/images/dashboardAssigned.png";

const chatFeatures = ref([
  "Instantly create and confirm purchase orders with our user-Friendly platform",
  "Optimize your inventory management with real-time details and availability",
  "Get 24/7 order insights and data reports",
]);
</script>

<template>
  <div class="mt-36">
    <div class="flex mt-20 flex-col">
      <div class="grid pl-5 grid-cols-1 lg:grid-cols-2">
        <div class="flex justify-center px-3 items-center">
          <img class="" :src="dashboardAssigned" alt="" />
        </div>

        <div
          class="flex flex-col gap-5 pr-20 pl-3 py-7 border-r-8 border-[#4B44F6]"
        >
          <span class="text-[#E12179] tracking-wide text-lg font-normal">
            ORDER
          </span>

          <p class="font-bold text-[40px]">
            Connect with Your Customers in Real-Time with Our Messaging Feature
          </p>
          <div
            class="flex gap-4 w-[22rem] flex-col font-normal text-2xl text-[#5C5A8F]"
          >
            <span v-for="(data, index) in chatFeatures" :key="index" class="">
              {{ data }}
            </span>
          </div>
        </div>
      </div>
      <div class="pl-5 mt-4 flex justify-end">
        <div class="w-1/2 flex justify-center">
          <div class="h-5 w-96 bg-[#E12179]" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
