<script setup>
import { storeToRefs } from "pinia";
import useInvoice from "src/stores/modules/useInvoices";
import { ref } from "vue";

const bgImage = ref(
  "bg-[url('https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80')]"
);

const country = ["United State", "Indonesia", "China"];
const phone = ["Afghanistan(+93)", "Indonesia(+62)"];

const phoneOptions = ref(phone);
const countryOptions = ref(country);
const invoice = useInvoice();
const { company, getCompanies } = storeToRefs(invoice);
const companyName = ref("");
const edit = ref(false);

// Function

const filterPhone = (val, update) => {
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

const filterCountry = (val, update) => {
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

const selectCompanies = ($event) => {
  invoice.selectedCompany($event);
};
</script>

<template>
  <div class="mt-5 rounded-lg">
    <div class="flex flex-col">
      <div class="w-full flex pb-4 justify-end">
        <q-btn @click="edit = !edit" color="primary">
          {{ edit ? "cancel" : "edit" }}
        </q-btn>
      </div>
      <div class="flex flex-col lg:flex-row justify-between">
        <div class="col-span-1 flex items-end">
          <div
            class="rounded-lg w-20 h-20 bg-cover bg-center"
            :class="bgImage"
          />
        </div>

        <div class="w-full lg:w-[375px] mt-3 lg:mt-0">
          <p class="label-style mb-2">Company Name</p>
          <q-select
            placeholder="Company Name"
            v-model="companyName"
            dense
            :options="getCompanies"
            option-label="name_english"
            option-value="company_number"
            outlined
            @update:model-value="selectCompanies"
          />
        </div>
      </div>

      <div class="grid gap-0 lg:gap-5 grid-cols-1 mt-5 lg:grid-cols-2">
        <div class="col-span-1">
          <div class="w-full">
            <p class="label-style mb-2">Address 1</p>
            <q-input
              v-model="company.address1"
              placeholder="Address 1"
              dense
              :disable="!edit"
              outlined
            />
          </div>
        </div>

        <div class="col-span-1">
          <div class="w-full">
            <p class="label-style mb-2">Address 2</p>
            <q-input
              v-model="company.address2"
              placeholder="Address 2"
              dense
              :disable="!edit"
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
              outlined
              dense
              :disable="!edit"
              v-model="company.country"
              use-input
              input-debounce="0"
              :options="countryOptions"
              @filter="filterCountry"
              behavior="menu"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>

        <div class="col-span-1">
          <div class="w-full">
            <p class="label-style mb-2">Phone</p>
            <q-select
              outlined
              dense
              :disable="!edit"
              v-model="company.phone"
              use-input
              input-debounce="0"
              :options="phoneOptions"
              @filter="filterPhone"
              behavior="menu"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </div>
      <div class="grid gap-0 lg:gap-5 grid-cols-1 mt-5 lg:grid-cols-2">
        <div class="col-span-1">
          <div class="w-full">
            <p class="label-style mb-2">ZIP/Province</p>
            <q-input
              placeholder="ZIP/Province"
              v-model="company.zip"
              dense
              :disable="!edit"
              outlined
            />
          </div>
        </div>

        <div class="col-span-1">
          <div class="w-full">
            <p class="label-style mb-2">City</p>
            <q-input
              :disable="!edit"
              placeholder="City"
              v-model="company.city"
              dense
              outlined
            />
          </div>
        </div>
      </div>

      <div v-if="edit" class="flex justify-end mt-16 gap-3">
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
