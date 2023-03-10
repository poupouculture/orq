<script setup lang="ts">
import { ref } from "vue";

const model = ref("Google");
const options = ref(["Google", "Facebook", "Twitter", "Apple", "Oracle"]);
</script>

<template>
  <div class="p-5 mt-5 w-full">
    <div class="flex mb-5 justify-between items-center">
      <div class="flex items-center w-1/2">
        <q-select
          class="w-[50%]"
          color="white"
          dense
          standout
          v-model="model"
          :options="options"
        />
      </div>
      <q-icon size="25px" color="primary" name="cloud_download" />
    </div>
    <div class="bg-white w-full rounded-lg p-5">
      <p class="font-medium">TO: <span>john@gmail.com</span></p>

      <div class="flex flex-col text-[#111827] justify-center items-center p-5">
        <p class="font-semibold text-lg">BALANCE DUE</p>
        <p class="font-normal text-sm">$100.00</p>
        <p class="font-normal py-3 text-sm">Thanks for choosing us!</p>

        <div class="flex py-4 gap-3 flex-col">
          <div class="flex gap-3 justify-between">
            <div class="w-[100px]">
              <p class="text-sm font-normal">Invoice</p>
            </div>
            <div class="flex w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[100px] ml-4">
              <p class="text-sm font-normal">INV-006</p>
            </div>
          </div>

          <div class="flex gap-3 justify-between">
            <div class="w-[100px]">
              <p class="text-sm font-normal">Due</p>
            </div>
            <div class="flex w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[100px] ml-4">
              <p class="text-sm font-normal">Feb 20, 2023</p>
            </div>
          </div>
          <div class="flex gap-3 justify-between">
            <div class="w-[100px]">
              <p class="text-sm font-normal">Total</p>
            </div>
            <div class="flex w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[100px] ml-4">
              <p class="text-sm font-normal">$100</p>
            </div>
          </div>
          <div class="flex gap-3 justify-between">
            <div class="w-[100px]">
              <p class="text-sm font-normal">Balance</p>
            </div>
            <div class="flex w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[100px] ml-4">
              <p class="text-sm font-normal">$100</p>
            </div>
          </div>
          <div class="flex gap-3 justify-between">
            <div class="w-[100px]">
              <p class="text-sm font-normal">Status</p>
            </div>
            <div class="flex w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[100px] ml-4">
              <p class="text-sm font-normal">Draft</p>
            </div>
          </div>
        </div>
        <q-btn label="Pay this invoice" color="primary" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
