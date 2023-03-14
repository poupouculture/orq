<script setup lang="ts">
import useInvoice from "src/stores/modules/useInvoices";

const { getInvoice, getCustomer, getCompany } = useInvoice();
</script>

<template>
  <div class="px-5 pt-5 pb-10 mt-5 rounded-lg bg-white w-full">
    <div class="grid py-5 border-b-2 pb-4 border-primary grid-cols-3">
      <div class="flex flex-col col-span-2">
        <p
          class="text-[#111827] border-b-2 pb-3 border-primary uppercase font-semibold text-base"
        >
          invoice
        </p>

        <div class="grid mt-3 grid-cols-2 gap-2">
          <div class="flex gap-2 flex-col">
            <p class="font-semibold text-sm">Invoice Number</p>
            <span class="text-xs text-gray-500">
              {{ getInvoice.invoiceNumber }}
            </span>
          </div>

          <div class="flex gap-2 flex-col">
            <p class="font-semibold text-sm">Date Issued</p>
            <span class="text-xs text-gray-500">
              {{ getInvoice.dateIssue }}</span
            >
          </div>

          <div class="flex gap-2 flex-col">
            <p class="font-semibold text-sm">Amount Due</p>
            <span class="text-xs text-gray-500">
              {{ getInvoice.totalPrice.label }}
            </span>
          </div>

          <div class="flex gap-2 flex-col">
            <p class="font-semibold text-sm">Due Date</p>
            <span class="text-xs text-gray-500">
              {{ getInvoice.dueDate }}
            </span>
          </div>

          <div class="flex gap-2 flex-col">
            <p class="font-semibold text-sm">Bill To</p>
            <span id="name" class="text-xs text-gray-500">
              {{ `${getCustomer.firstName.value} ${getCustomer.lastName}` }}
            </span>
            <span id="email" class="text-xs text-gray-500">
              {{ getCustomer.email }}
            </span>
            <div class="flex gap-1 text-xs text-gray-500">
              <span class=""> {{ getCustomer.address1 }} </span>
            </div>
            <div class="flex gap-1 text-xs text-gray-500">
              <span class=""> {{ getCustomer.address2 }} </span>
            </div>
            <div class="flex gap-1 text-xs text-gray-500">
              <span class=""> {{ getCustomer.phone }} </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-1 flex justify-center items-center">
        <div class="flex flex-col gap-5">
          <q-icon size="32px" color="primary" name="rocket_launch" />

          <div class="flex gap-2 flex-col">
            <p
              v-for="(company, index) in getCompany"
              :key="index"
              :class="[
                index == 'companyName'
                  ? 'font-semibold text-sm'
                  : 'text-xs text-gray-500',
              ]"
              class=""
            >
              {{ company }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full flex flex-col">
      <div class="grid grid-cols-6 py-5">
        <div class="col-span-3">
          <p class="font-semibold ml-3 text-sm">ITEM DESCRIPTION</p>
        </div>

        <div class="col-span-1 flex justify-center">
          <p class="font-semibold text-sm">RATE</p>
        </div>
        <div class="col-span-1 flex justify-center">
          <p class="font-semibold text-sm">QTY</p>
        </div>
        <div class="col-span-1 flex justify-center">
          <p class="font-semibold text-sm">AMOUNT</p>
        </div>
      </div>
      <div
        class="rounded-lg grid grid-cols-1 divide-y-2 h-full w-full bg-[#F3F3FD]"
      >
        <div
          v-for="(item, index) in getInvoice.items"
          :key="index"
          class="grid items-center grid-cols-6 py-5 w-full"
        >
          <div class="col-span-3">
            <p class="font-semibold ml-3 text-[#9A9AAF] text-xs">
              {{ item.item }}
            </p>
          </div>

          <div class="col-span-1 flex justify-center">
            <p class="font-semibold text-[#9A9AAF] text-xs">{{ item.rate }}</p>
          </div>
          <div class="col-span-1 flex justify-center">
            <p class="font-semibold text-[#9A9AAF] text-xs">{{ item.qty }}</p>
          </div>
          <div class="col-span-1 flex justify-center">
            <p class="font-semibold text-[#9A9AAF] text-xs">
              {{ item.amount.label }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid items-center mt-3 w-full grid-cols-6 h-[30px]">
        <div class="col-span-4"></div>
        <div class="col-span-1 text-center">
          <p class="font-semibold text-sm">Sub total:</p>
        </div>

        <div class="col-span-1 text-center">
          <p>{{ getInvoice.totalPrice.label }}</p>
        </div>
      </div>
      <div class="grid items-center w-full grid-cols-6 h-[30px]">
        <div class="col-span-4"></div>
        <div class="col-span-1 text-center">
          <p class="font-semibold text-sm">Total:</p>
        </div>
        <div class="col-span-1 text-center">
          <p>{{ getInvoice.totalPrice.label }}</p>
        </div>
      </div>
      <div class="grid items-center w-full grid-cols-6 h-[30px]">
        <div class="col-span-3"></div>
        <div class="flex justify-end text-white col-span-2">
          <div class="bg-primary py-2 w-[63%] text-end">
            <p class="font-semibold text-sm">Balance Due:</p>
          </div>
        </div>
        <div class="bg-primary py-2 text-white col-span-1 text-center">
          <p class="font-semibold text-sm">{{ getInvoice.totalPrice.label }}</p>
        </div>
      </div>

      <div v-if="getInvoice.optional.notes" class="flex gap-2 flex-col">
        <p class="font-semibold text-sm">Notes</p>
        <span class="text-xs text-gray-500">
          {{ getInvoice.optional.notes }}
        </span>
      </div>

      <div v-if="getInvoice.optional.terms" class="flex gap-2 mt-3 flex-col">
        <p class="font-semibold text-sm">Terms</p>
        <span class="text-xs text-gray-500">
          {{ getInvoice.optional.terms }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
