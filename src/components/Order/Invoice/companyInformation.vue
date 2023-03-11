<script setup lang="ts">
import useInvoice from "src/stores/modules/useInvoices";
import { ref } from "vue";

const bgImage = ref(
  "bg-[url('https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80')]"
);

const options = ref(["United State", "Facebook", "Twitter", "Apple", "Oracle"]);
const { getCompany } = useInvoice();
</script>

<template>
  <div class="mt-5 rounded-lg">
    <div class="flex flex-col">
      <div class="flex flex-col lg:flex-row justify-between">
        <div class="col-span-1 flex items-end">
          <div
            class="rounded-lg w-20 h-20 bg-cover bg-center"
            :class="bgImage"
          />
        </div>

        <div class="w-full lg:w-[375px] mt-3 lg:mt-0">
          <p class="label-style mb-2">Company Name</p>
          <q-input
            v-model="getCompany.companyName"
            placeholder="Company Name"
            dense
            outlined
          />
        </div>
      </div>

      <div class="grid gap-0 lg:gap-5 grid-cols-1 mt-5 lg:grid-cols-2">
        <div class="col-span-1">
          <div class="w-full">
            <p class="label-style mb-2">Address 1</p>
            <q-input
              v-model="getCompany.address1"
              placeholder="Address 1"
              dense
              outlined
            />
          </div>
        </div>

        <div class="col-span-1">
          <div class="w-full">
            <p class="label-style mb-2">Address 2</p>
            <q-input
              v-model="getCompany.address2"
              placeholder="Address 2"
              dense
              outlined
            />
          </div>
        </div>
      </div>
      <div class="grid gap-0 lg:gap-5 grid-cols-1 mt-5 lg:grid-cols-2">
        <div class="col-span-1">
          <div class="w-full">
            <p class="label-style mb-2">Country</p>
            <q-select
              dense
              outlined
              v-model="getCompany.country"
              :options="options"
            />
          </div>
        </div>

        <div class="col-span-1">
          <div class="w-full">
            <p class="label-style mb-2">Phone</p>
            <q-input
              placeholder="Phone"
              v-model="getCompany.phone"
              dense
              outlined
            />
          </div>
        </div>
      </div>
      <div class="grid gap-0 lg:gap-5 grid-cols-1 mt-5 lg:grid-cols-2">
        <div class="col-span-1">
          <div class="w-full">
            <p class="label-style mb-2">ZIP/Province</p>
            <q-input
              placeholder="ZIP/Province"
              v-model="getCompany.zip"
              dense
              outlined
            />
          </div>
        </div>

        <div class="col-span-1">
          <div class="w-full">
            <p class="label-style mb-2">City</p>
            <q-input
              placeholder="City"
              v-model="getCompany.city"
              dense
              outlined
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-16 gap-3">
        <button
          class="rounded-lg py-2 px-4 border-dotted border-2 text-primary border-primary"
        >
          Cancel
        </button>
        <button class="rounded-lg py-2 px-4 text-white bg-primary">Save</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
