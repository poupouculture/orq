<script setup lang="ts">
import { reactive } from "vue";
import useInvoice from "src/stores/modules/useInvoices";
import ShareButton from "src/components/Order/Invoice/shareButton.vue";

const { getInvoice, getCustomer, getTotalPrice, getTax } = useInvoice();
const shareInvoice = reactive({
  via: "Email",
  setDefault: true,
});
</script>

<template>
  <div class="p-5 mt-5 w-full">
    <div class="flex mb-5 justify-between items-center">
      <div class="flex items-center w-1/2">
        <ShareButton
          v-model:shareInvoice="shareInvoice"
          @update:via="(newValue) => (shareInvoice.via = newValue)"
          @update:setDefault="
            (newValue) => (shareInvoice.setDefault = newValue)
          "
        />
      </div>
      <q-icon size="25px" color="primary" name="cloud_download" />
    </div>
    <div class="bg-white w-full rounded-lg p-5">
      <p class="font-medium">
        TO: <span class="font-bold pl-2">{{ getCustomer.email }}</span>
      </p>

      <div class="flex flex-col text-[#111827] justify-center items-center p-5">
        <p class="font-semibold text-lg">BALANCE DUE</p>
        <p class="font-normal text-sm">{{ getInvoice.totalPrice.label }}</p>
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
              <p class="text-sm font-normal">{{ getInvoice.invoiceNumber }}</p>
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
              <p class="text-sm font-normal">{{ getInvoice.dueDate }}</p>
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
              <p class="text-sm font-normal">
                {{ getInvoice.totalPrice.label }}
              </p>
            </div>
          </div>

          <div
            v-for="(item, index) in getTax"
            :key="index"
            class="flex gap-3 justify-between"
          >
            <div class="w-[100px]">
              <p class="text-sm font-normal">
                {{ item.taxName }}
                <span class="text-primary">{{ item.percentage }}%</span>
              </p>
            </div>
            <div class="flex w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[100px] ml-4">
              <p class="text-sm font-normal">
                {{ item.taxPrice.label }}
              </p>
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
              <p class="text-sm font-normal">
                {{ getTotalPrice.label }}
              </p>
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
