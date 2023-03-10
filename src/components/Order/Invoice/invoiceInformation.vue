<script setup lang="ts">
import { ref } from "vue";

const model = ref("United State");
const options = ref(["United State", "Facebook", "Twitter", "Apple", "Oracle"]);
const setInput = ref(false);
const issueDate = ref(null);
const dueDate = ref(null);
</script>

<template>
  <div class="mt-5">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Invoice Number</p>
          <q-input placeholder="Invoice Number" dense outlined />
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Status</p>
          <q-select dense outlined v-model="model" :options="options" />
          <div class="flex items-center mt-2">
            <q-checkbox size="xs" v-model="setInput" />
            <span class="text-sm font-normal text-[#9A9AAF]">
              set as default
            </span>
          </div>
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Date Issue</p>
          <q-input
            bg-color="white"
            v-model="issueDate"
            :rules="['date']"
            placeholder="Due Date"
            dense
            outlined
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="issueDate"
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Due Date</p>
          <q-input
            bg-color="white"
            v-model="dueDate"
            :rules="['date']"
            placeholder="Due Date"
            dense
            outlined
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="dueDate"
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <div class="col-span-2 mt-5">
        <div class="grid grid-cols-6">
          <div class="col-span-3">
            <p class="font-semibold text-base">Items</p>
          </div>
          <div class="col-span-1 text-center">
            <p class="font-semibold text-base">Qty</p>
          </div>
          <div class="col-span-1 text-center">
            <p class="font-semibold text-base">Rate</p>
          </div>
          <div class="col-span-1 text-center">
            <p class="font-semibold text-base">Amount</p>
          </div>
        </div>
      </div>

      <div class="col-span-2">
        <div class="grid grid-cols-6">
          <div class="col-span-3">
            <p class="font-extralight text-[#2E2E3A] text-xs">hand bag</p>
          </div>
          <div class="col-span-1 text-center">
            <p class="font-extralight text-[#2E2E3A] text-xs">25</p>
          </div>
          <div class="col-span-1 text-center">
            <p class="font-extralight text-[#2E2E3A] text-xs">$2.00</p>
          </div>
          <div class="col-span-1 text-center">
            <p class="font-extralight text-[#2E2E3A] text-xs">$50.00</p>
          </div>
        </div>
      </div>

      <div class="col-span-2">
        <div class="grid gap-5 grid-cols-6">
          <div class="col-span-3">
            <q-input placeholder="Add Description" dense outlined />
          </div>
          <div class="col-span-1 text-center px-2">
            <q-input placeholder="0" dense outlined />
          </div>
          <div class="col-span-1 text-center px-2">
            <q-input placeholder="0" dense outlined />
          </div>
          <div class="col-span-1 text-center px-2">
            <q-input placeholder="0" dense outlined />
          </div>
        </div>
      </div>
    </div>

    <div class="w-full flex justify-end mt-5">
      <div class="flex text-primary gap-3 flex-col">
        <div class="text-end flex gap-5">
          <span class="w-[80px]">Total</span>
          <span class="w-[80px]">$100.00</span>
        </div>
        <div class="text-end flex gap-5">
          <span class="w-[80px]">Add tax</span>
          <span class="w-[80px]">$0</span>
        </div>
        <div class="text-end flex gap-5">
          <span class="text-end">Add discount</span>
          <span class="w-[80px]">$00</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div class="w-full">
        <p class="label-style mb-2">Notes (Optional)</p>
        <q-input placeholder="Notes or payment details" dense outlined />
      </div>
      <div class="w-full">
        <p class="label-style mb-2">Terms</p>
        <q-input placeholder="Terms & conditions" dense outlined />
      </div>

      <p class="text-base font-semibold">Custom fields</p>
      <div class="flex items-center">
        <q-checkbox size="xs" v-model="setInput" />
        <span class="text-sm font-normal text-[#9A9AAF]">
          Add custom field
        </span>
      </div>
      <div class="flex items-center">
        <q-checkbox size="xs" v-model="setInput" />
        <span class="text-sm font-normal text-[#9A9AAF]"> Memo </span>
      </div>
      <div class="flex items-center">
        <q-checkbox size="xs" v-model="setInput" />
        <span class="text-sm font-normal text-[#9A9AAF]"> Footer </span>
      </div>
      <div class="">
        <q-btn color="primary" icon-right="east" label="Payment Setting" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
