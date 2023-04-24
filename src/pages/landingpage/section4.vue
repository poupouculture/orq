<script setup lang="ts">
import { ref } from "vue";
import paymentOrder from "src/assets/images/paymentOrder.png";

const chatFeatures = ref([
  "Instantly confirm purchase orders that can sync to your Ordering system",
  "Optimize issuing of  invoices with real-time details",
  "Get 24/7 order insights and data reports",
]);
</script>

<template>
  <div class="mt-36">
    <div class="flex mt-20 flex-col">
      <div class="grid pl-5 grid-cols-1 lg:grid-cols-2">
        <div class="flex justify-center px-3 items-center">
          <img class="" :src="paymentOrder" alt="" />
        </div>

        <div
          class="flex flex-col gap-5 pr-20 pl-3 py-7 border-r-8 border-[#4B44F6]"
        >
          <span class="text-[#E12179] tracking-wide text-lg font-normal">
            ORDER/ INVOICE
          </span>

          <p class="font-bold text-[40px]">
            Invoice creation and fulfillment, ensuring timely delivery to
            customers
          </p>
          <div
            class="flex gap-4 flex-col font-normal text-[26px] text-[#5C5A8F]"
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
