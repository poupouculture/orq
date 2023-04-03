<script setup lang="ts">
import useInvoice from "src/stores/modules/useInvoices";
import { storeToRefs } from "pinia";

const invoice = useInvoice();
const {
  getInvoice,
  getCustomer,
  getCompany,
  getTax,
  getTotalPrice,
  getDiscount,
} = storeToRefs(invoice);
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

      <div class="w-full flex justify-end mt-5">
        <div class="flex gap-1 w-[236px] flex-col">
          <div class="text-end flex gap-5">
            <span class="w-[100px] font-semibold text-sm"> Sub total: </span>
            <span class="w-[100px]">
              {{ getInvoice.totalPrice.label }}
            </span>
          </div>

          <template v-if="getInvoice.tax.length > 0">
            <div
              v-for="(tax, index) in getTax"
              :key="index"
              class="text-end flex gap-5"
            >
              <span class="w-[100px] font-semibold text-sm">
                {{ tax.taxName }}
                <span class="text-primary"> {{ `${tax.percentage}%` }}</span
                >:
              </span>
              <span class="w-[100px]">
                {{ tax.taxPrice.label }}
              </span>
            </div>
          </template>

          <template v-if="getDiscount.length > 0">
            <div
              v-for="(discount, index) in getDiscount"
              :key="index"
              class="text-end flex gap-5"
            >
              <span class="w-[100px] font-semibold text-sm">
                {{ discount.discountName }}
                <span class="text-red-500">
                  {{ `${discount.percentage}%` }}</span
                >:
              </span>
              <span class="w-[100px] text-red-500">
                -{{ discount.discountPrice.label }}
              </span>
            </div>
          </template>

          <div class="text-end flex gap-5">
            <span class="w-[100px] font-semibold text-sm"> Total: </span>
            <span class="w-[100px]">
              {{ getTotalPrice.label }}
            </span>
          </div>

          <div class="text-end bg-primary text-white py-2 flex gap-5">
            <span class="w-[100px] font-semibold text-sm"> Balance Due: </span>
            <span class="w-[100px]">
              {{ getTotalPrice.label }}
            </span>
          </div>
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

      <div
        v-if="getInvoice.optional.memo.option"
        class="flex gap-2 mt-3 flex-col"
      >
        <p class="font-semibold text-sm">Memo</p>
        <span class="text-xs text-gray-500">
          {{ getInvoice.optional.memo.memo }}
        </span>
      </div>

      <div class="flex mt-3 justify-between">
        <div class="font-bold gap-10 flex flex-col py-3">
          <div class="border-b">
            <p class="pb-2">For and on behalf of the buyer:</p>
          </div>

          <div class="text-sm text-slate-400 border-t">
            <p class="pt-2">{{ getCompany.companyName }}</p>
          </div>
        </div>

        <div class="font-bold gap-10 flex flex-col py-3">
          <div class="border-b">
            <p class="pb-2">Confirmed by the supplier:</p>
          </div>

          <div class="text-sm text-slate-400 border-t">
            <p class="pt-2">{{ getCompany.companyName }}</p>
          </div>
        </div>
      </div>

      <div v-if="getInvoice.optional.footer.option">
        <p class="text-xs text-gray-500">
          {{ getInvoice.optional.footer.value }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
