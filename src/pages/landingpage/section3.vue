<script setup lang="ts">
import { ref } from "vue";
import VectorLiquid from "src/assets/images/vectorLiquid2.png";
import dashboardAssigned from "src/assets/images/dashboardAssigned.png";

const chatFeatures = ref([
  "Create chats with any business",
  "Fully integrated with your favorite chat apps",
  "Real-time messages and alerts",
]);
</script>

<template>
  <div class="mt-36">
    <div class="pl-5 flex flex-col justify-between relative">
      <span class="text-[#E12179] tracking-wide text-[23px] font-normal">
        HOW IT WORKS
      </span>

      <p class="text-black text-[40px] font-black w-[749px] leading-[57px]">
        The Simple Way to Manage Your Orders, Invoices, and Payments
      </p>

      <RouterLink
        to="/"
        class="text-[#5C5A8F] border-b-4 w-[170px] border-[#E12179] items-center mt-3 flex gap-4"
      >
        <span class="text-2xl">Learn more</span>

        <q-icon name="chevron_right" size="30px" class="text-[#E12179]" />
      </RouterLink>

      <img :src="VectorLiquid" class="w-32 absolute -top-32 -right-[69px]" />
    </div>

    <div class="flex mt-20 flex-col">
      <div class="grid pl-5 grid-cols-1 lg:grid-cols-2">
        <div class="flex flex-col gap-5 pl-20 py-7 border-l-8 border-[#4B44F6]">
          <span class="text-[#E12179] tracking-wide text-lg font-normal">
            CHAT
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

        <div class="flex justify-center px-3 items-center">
          <img class="" :src="dashboardAssigned" alt="" />
        </div>
      </div>
      <div class="pl-5">ddd</div>
    </div>
  </div>
</template>

<style scoped></style>
