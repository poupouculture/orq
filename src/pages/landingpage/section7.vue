<script setup lang="ts">
import blackDoubleQuote from "src/assets/images/blackDoubleQuote.png";
import whiteDoubleQuote from "src/assets/images/whiteDoubleQuote.png";
import { ref } from "vue";
const testimoni = ref([
  {
    active: false,
  },
  {
    active: true,
  },
  {
    active: false,
  },
]);
</script>

<template>
  <div class="mt-36">
    <div class="pl-5 flex flex-col">
      <span class="text-[#E12179] tracking-wide text-[23px] font-normal">
        HAPPY CUSTOMER
      </span>

      <p class="text-black text-[40px] font-black w-[602px] leading-[57px]">
        What People Say
      </p>
    </div>

    <div class="w-full mt-36 flex justify-center">
      <div class="grid gap-16 lg:grid-cols-3">
        <div
          v-for="(data, index) in testimoni"
          :key="index"
          class="flex flex-col gap-10 rounded-lg drop-shadow-2xl w-full px-10 py-16"
          :class="data.active ? 'bg-[#4B44F6]' : 'bg-white'"
        >
          <div class="flex -mt-40 rounded-full justify-center">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
              class="rounded-full w-44"
              :class="{ 'drop-shadow-2xl ring-8 ring-[#4B44F6]': data.active }"
              alt=""
            />
          </div>

          <div class="">
            <img
              :src="data.active ? whiteDoubleQuote : blackDoubleQuote"
              class="w-10"
              alt=""
            />
          </div>

          <div>
            <p
              :class="data.active ? 'text-white' : 'text-[#5C5A8F]'"
              class="leading-8"
            >
              We've been using this web app for our business for months now, and
              it's completely changed the way we handle orders & payments. It's
              so easy to use and has helped us get paid faster than ever before!
            </p>
          </div>

          <div class="flex flex-col">
            <p
              class="font-black text-xl"
              :class="data.active ? 'text-white' : 'text-[#5C5A8F]'"
            >
              John smith
            </p>

            <span
              :class="data.active ? 'text-white' : 'text-[#5C5A8F]'"
              class="font-medium text-lg"
            >
              Sales Manager
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="grid grid-cols-1 mt-10 sm:grid-cols-3 gap-16">
      <div
        v-for="(client, index) in clients"
        :key="index"
        class="flex justify-center"
      >
        <img :src="client" class="w-32" alt="" />
      </div>
    </div> -->
  </div>
</template>

<style scoped></style>
