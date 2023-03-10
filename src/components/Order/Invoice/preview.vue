<script setup lang="ts"></script>

<template>
  <div class="p-5 mt-5 rounded-lg bg-white w-full">
    <div class="grid border-b-2 pb-4 border-primary grid-cols-3">
      <div class="flex flex-col col-span-2">
        <p
          class="text-[#111827] border-b-2 pb-3 border-primary uppercase font-semibold text-base"
        >
          invoice
        </p>

        <div class="grid mt-3 grid-cols-2 gap-2">
          <div class="flex gap-2 flex-col">
            <p class="font-semibold text-sm">Invoice Number</p>
            <span class="text-xs text-gray-500"> INV-00001 </span>
          </div>

          <div class="flex gap-2 flex-col">
            <p class="font-semibold text-sm">Date Issued</p>
            <span class="text-xs text-gray-500"> Feb 19, 2023 </span>
          </div>

          <div class="flex gap-2 flex-col">
            <p class="font-semibold text-sm">Amount Due</p>
            <span class="text-xs text-gray-500"> $50 </span>
          </div>

          <div class="flex gap-2 flex-col">
            <p class="font-semibold text-sm">Due Date</p>
            <span class="text-xs text-gray-500"> Feb 19, 2023 </span>
          </div>

          <div class="flex gap-2 flex-col">
            <p class="font-semibold text-sm">Bill To</p>
            <span id="name" class="text-xs text-gray-500"> John </span>
            <span id="email" class="text-xs text-gray-500">
              john@gmail.com
            </span>
            <div class="flex gap-1 text-xs text-gray-500">
              <span class=""> Address: </span>
              <span class=""> St Nyc </span>
            </div>
            <div class="flex gap-1 text-xs text-gray-500">
              <span class=""> Phone: </span>
              <span class=""> +11122399 </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-1 flex justify-center items-center">
        <div class="flex flex-col gap-5">
          <q-icon size="32px" color="primary" name="rocket_launch" />

          <div class="flex gap-2 flex-col">
            <p class="font-semibold text-sm">Synque</p>
            <span id="name" class="text-xs text-gray-500"> John </span>
            <span id="email" class="text-xs text-gray-500">
              john@gmail.com
            </span>
            <div class="flex gap-1 text-xs text-gray-500">
              <span class=""> Address: </span>
              <span class=""> St Nyc </span>
            </div>
            <div class="flex gap-1 text-xs text-gray-500">
              <span class=""> Phone: </span>
              <span class=""> +11122399 </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full grid grid-rows-5">
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
      <div class="grid items-center rounded-lg grid-cols-6 w-full bg-[#F3F3FD]">
        <div class="col-span-3">
          <p class="font-semibold ml-3 text-[#9A9AAF] text-xs">no item</p>
        </div>

        <div class="col-span-1 flex justify-center">
          <p class="font-semibold text-[#9A9AAF] text-xs">$0.00</p>
        </div>
        <div class="col-span-1 flex justify-center">
          <p class="font-semibold text-[#9A9AAF] text-xs">0</p>
        </div>
        <div class="col-span-1 flex justify-center">
          <p class="font-semibold text-[#9A9AAF] text-xs">$0.00</p>
        </div>
      </div>

      <div class="grid items-center mt-3 w-full grid-cols-6 h-[30px]">
        <div class="col-span-4"></div>
        <div class="col-span-1 text-center">
          <p class="font-semibold text-sm">Sub total:</p>
        </div>

        <div class="col-span-1 text-center">
          <p>$00.00</p>
        </div>
      </div>
      <div class="grid items-center w-full grid-cols-6 h-[30px]">
        <div class="col-span-4"></div>
        <div class="col-span-1 text-center">
          <p class="font-semibold text-sm">Total:</p>
        </div>
        <div class="col-span-1 text-center">
          <p>$00.00</p>
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
          <p class="font-semibold text-sm">100</p>
        </div>
      </div>

      <div class="flex gap-2 flex-col">
        <p class="font-semibold text-sm">Notes</p>
        <span class="text-xs text-gray-500"> nothing notes </span>
      </div>

      <div class="flex gap-2 mt-3 flex-col">
        <p class="font-semibold text-sm">Terms</p>
        <span class="text-xs text-gray-500">
          pay the invoice within due date
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
