<script setup lang="ts">
import useInvoice from "src/stores/modules/useInvoices";
import { ref } from "vue";

const options = ref(["United State", "Facebook", "Twitter", "Apple", "Oracle"]);
const { getCustomer } = useInvoice();
</script>

<template>
  <div class="mt-5">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">First Name</p>
          <q-input
            v-model="getCustomer.firstName.value"
            placeholder="First Name"
            dense
            outlined
          />
          <div class="flex items-center mt-2">
            <q-checkbox size="xs" v-model="getCustomer.firstName.setDefault" />
            <span class="text-sm font-normal text-[#9A9AAF]">
              set as default for future invoices
            </span>
          </div>
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Last Name</p>
          <q-input
            v-model="getCustomer.lastName"
            placeholder="Last Name"
            dense
            outlined
          />
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Email</p>
          <q-input
            v-model="getCustomer.email"
            placeholder="Email"
            dense
            outlined
          />
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Language</p>
          <q-select
            dense
            outlined
            v-model="getCustomer.language"
            :options="options"
          />
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Country</p>
          <q-select
            dense
            outlined
            v-model="getCustomer.country"
            :options="options"
          />
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">City</p>
          <q-input
            placeholder="City"
            v-model="getCustomer.city"
            dense
            outlined
          />
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">ZIP/Province</p>
          <q-input
            placeholder="ZIP/Province"
            v-model="getCustomer.zip"
            dense
            outlined
          />
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Phone</p>
          <q-input
            placeholder="Phone"
            v-model="getCustomer.phone"
            dense
            outlined
          />
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Address 1</p>
          <q-input
            placeholder="Address 1"
            v-model="getCustomer.address1"
            dense
            outlined
          />
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Address 2</p>
          <q-input
            placeholder="Address 2"
            v-model="getCustomer.address2"
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
</template>

<style scoped></style>
