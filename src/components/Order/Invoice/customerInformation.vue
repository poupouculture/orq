<script setup lang="ts">
import useInvoice from "src/stores/modules/useInvoices";
import { ref } from "vue";

const country = ["United State", "Indonesia", "China"];
const language = ["English", "Germany"];
const phone = ["Afghanistan(+93)", "Indonesia(+62)"];

const languageOptions = ref(language);
const countryOptions = ref(country);
const phoneOptions = ref(phone);

const { getCustomer } = useInvoice();

const filterCountry = (val: any, update: any) => {
  if (val === "") {
    update(() => {
      countryOptions.value = country;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    countryOptions.value = country.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

const filterLanguage = (val: any, update: any) => {
  if (val === "") {
    update(() => {
      languageOptions.value = language;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    languageOptions.value = language.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

const filterPhone = (val: any, update: any) => {
  if (val === "") {
    update(() => {
      phoneOptions.value = phone;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    phoneOptions.value = phone.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};
</script>

<template>
  <div class="mt-5">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div class="col-span-2 grid grid-cols-2">
        <div class="col-span-1">
          <div class="w-full">
            <q-input placeholder="Search" dense outlined>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </div>
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
            <span class="text-xs font-normal text-[#9A9AAF]">
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
            outlined
            dense
            v-model="getCustomer.language"
            use-input
            input-debounce="0"
            :options="languageOptions"
            @filter="filterLanguage"
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
      <div class="col-span-1">
        <div class="w-full">
          <p class="label-style mb-2">Country</p>
          <q-select
            outlined
            dense
            v-model="getCustomer.country"
            use-input
            input-debounce="0"
            :options="countryOptions"
            @filter="filterCountry"
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
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
          <q-select
            outlined
            dense
            v-model="getCustomer.phone"
            use-input
            input-debounce="0"
            :options="phoneOptions"
            @filter="filterPhone"
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
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
