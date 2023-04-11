<script setup lang="ts">
import { storeToRefs } from "pinia";
import useInvoice from "src/stores/modules/useInvoices";

const invoice = useInvoice();
const { getInvoice, getCustomer, getTotalPrice } = storeToRefs(invoice);
</script>

<template>
  <div class="p-5 mt-5 w-full">
    <div class="bg-white w-full rounded-lg p-5">
      <p class="font-medium">
        TO: <span class="font-bold pl-2">{{ getCustomer.email }}</span>
      </p>

      <div class="flex flex-col text-[#111827] justify-center items-center p-5">
        <p class="font-semibold text-lg">BALANCE DUE</p>
        <p class="font-normal text-sm">{{ getTotalPrice.label }}</p>
        <p class="font-normal py-3 text-sm">Thanks for choosing us!</p>

        <div class="flex py-4 gap-3 flex-col">
          <div class="flex gap-3 justify-between">
            <div class="w-[66px] lg:w-[100px]">
              <p class="text-sm font-normal">Invoice</p>
            </div>
            <div class="flex w-[66px] lg:w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[66px] lg:w-[100px] ml-4">
              <p class="text-sm font-normal">{{ getInvoice.invoiceNumber }}</p>
            </div>
          </div>

          <div class="flex gap-3 justify-between">
            <div class="w-[66px] lg:w-[100px]">
              <p class="text-sm font-normal">Due</p>
            </div>
            <div class="flex w-[66px] lg:w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[66px] lg:w-[100px] ml-4">
              <p class="text-sm font-normal">{{ getInvoice.dueDate }}</p>
            </div>
          </div>

          <div class="flex gap-3 justify-between">
            <div class="w-[66px] lg:w-[100px]">
              <p class="text-sm font-normal">Total</p>
            </div>
            <div class="flex w-[66px] lg:w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[66px] lg:w-[100px] ml-4">
              <p class="text-sm font-normal">
                {{ getInvoice.totalPrice.label }}
              </p>
            </div>
          </div>

          <div class="flex gap-3 justify-between">
            <div class="w-[66px] lg:w-[100px]">
              <p class="text-sm font-normal">Balance</p>
            </div>
            <div class="flex w-[66px] lg:w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[66px] lg:w-[100px] ml-4">
              <p class="text-sm font-normal">
                {{ getTotalPrice.label }}
              </p>
            </div>
          </div>
          <div class="flex gap-3 justify-between">
            <div class="w-[66px] lg:w-[100px]">
              <p class="text-sm font-normal">Status</p>
            </div>
            <div class="flex w-[66px] lg:w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[66px] lg:w-[100px] ml-4">
              <p class="text-sm font-normal">{{ getInvoice.status.value }}</p>
            </div>
          </div>
        </div>
        <q-btn label="Pay this invoice" color="primary" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
