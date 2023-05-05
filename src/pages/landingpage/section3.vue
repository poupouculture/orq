<script setup lang="ts">
import { ref } from "vue";
import dashboardAssigned from "src/assets/images/dashboardAssigned.png";
import customerGroupIcon from "src/assets/images/customerGroupIcon.png";

//

const chatFeatures = ref([
  "Create chats with any business",
  "Fully integrated with your favorite chat apps",
  "Real-time messages and alerts",
]);

const customersRelationship = ref([
  "Ability to create and manage customer groups",
  "Automated routing of customer queries to the appropriate team or individual",
  "User-friendly interface for easy navigation an management of customer groups",
]);
</script>

<template>
  <div class="mt-36">
    <div class="flex mt-20 flex-col">
      <div class="sm:pl-5 mb-10 flex gap-7 flex-col">
        <span class="text-[#E12179] tracking-wide text-[23px] font-normal">
          HOW IT WORKS
        </span>

        <p
          class="text-black text-[40px] font-black sm:w-[683px] leading-[57px]"
        >
          Power your commerce with chat. The Simple Way to Manage Your
          Customers, Invoices, and Payments
        </p>

        <span
          class="w-[109px] border-b-4 pb-1 border-[#E12179] items-center font-['Red_Hat_Display'] flex gap-5 text-[#5C5A8F]"
        >
          Learn more
          <q-icon name="chevron_right" class="text-[#E12179]" />
        </span>
      </div>
      <div class="grid sm:pl-5 grid-cols-1 lg:grid-cols-2">
        <div
          class="flex flex-col gap-5 sm:pl-20 pr-4 py-7 sm:border-l-8 sm:border-[#4B44F6]"
        >
          <span class="text-[#E12179] tracking-wide text-lg font-normal">
            CHAT COMMERCE
          </span>

          <p class="font-bold text-[40px]">
            Connect with Your Customers in Real-Time with Our Messaging Feature
          </p>
          <div
            class="flex gap-4 w-[22rem] flex-col font-normal text-lg font-['Red_Hat_Display'] text-[#5C5A8F]"
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

      <div class="grid sm:pl-5 grid-cols-1 mt-20 lg:grid-cols-2">
        <div
          class="flex flex-col gap-5 sm:pl-20 pr-4 py-7 sm:border-l-8 sm:border-[#4B44F6]"
        >
          <span class="text-[#E12179] tracking-wide text-lg font-normal">
            CUSTOMER RELATIONSHIPS
          </span>

          <p class="font-bold text-[40px]">Customer Profiling</p>
          <div
            class="flex gap-4 flex-col font-normal text-lg font-['Red_Hat_Display'] text-[#5C5A8F]"
          >
            <span
              v-for="(data, index) in customersRelationship"
              :key="index"
              class=""
            >
              {{ data }}
            </span>
          </div>
        </div>

        <div class="flex justify-center sm:px-3 items-center">
          <img class="" :src="customerGroupIcon" alt="" />
        </div>
      </div>
      <div class="pl-5 w-1/2 mt-4 flex justify-center">
        <div class="h-5 w-96 bg-[#E12179]" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
