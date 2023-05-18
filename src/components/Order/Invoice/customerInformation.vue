<script setup>
import useInvoice from "src/stores/modules/useInvoices";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";

const country = ["United State", "Indonesia", "China"];
const language = ["English", "Germany"];
const phone = ["Afghanistan(+93)", "Indonesia(+62)"];

const invoice = useInvoice();
const { getSelectedCustomers, getCompany, customer } = storeToRefs(invoice);

const languageOptions = ref(language);
const countryOptions = ref(country);
const phoneOptions = ref(phone);
const drawer = ref(false);
const selectCustomer = ref();
const tableSelected = ref([]);
const search = ref("");
const edit = ref(false);

// Table
const tableHead = ref([
  {
    name: "fullName",
    label: "Full Name",
    field: "fullName",
    align: "left",
  },
  {
    name: "customer_company_name_en",
    label: "Customer Name",
    field: "customer_company_name_en",
    align: "left",
  },
  {
    name: "customer_code",
    label: "Customer Code",
    field: "customer_code",
    align: "left",
  },
  {
    name: "location_code",
    label: "Location Code",
    field: "location_code",
    align: "left",
  },
]);


const getWidth = () => {
  if(screen.width < 500){
    return screen.width;
  }
  return 800;
}
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

const filterLanguage = (val, update) => {
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

const selectedUser = () => {
  drawer.value = !drawer.value;
  invoice.selectedCustomer(tableSelected.value[0]);
};

watch(getCompany, () => {
  selectCustomer.value = "";
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <div class="mt-5">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div class="col-span-2 grid grid-cols-2 mb-[30px]">
            <div class="col-span-1">
              <div class="w-full sm:w-[226px]">
                <q-btn @click="drawer = true" color="primary">
                  add customer
                </q-btn>
              </div>
            </div>

            <div class="col-span-1">
              <div v-if="!edit" class="w-full flex pb-4 justify-end">
                <q-btn @click="edit = !edit" color="primary"> edit </q-btn>
              </div>
            </div>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <div class="w-full">
              <p class="label-style mb-2">First Name</p>
              <q-input
                v-model="customer.firstName.value"
                placeholder="First Name"
                dense
                outlined
                :disable="!edit"
              />
              <div class="flex items-center mt-2">
                <q-checkbox
                  :disable="!edit"
                  size="xs"
                  v-model="customer.firstName.setDefault"
                />
                <span class="text-xs font-normal text-[#9A9AAF]">
                  set as default for future invoices
                </span>
              </div>
            </div>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <div class="w-full">
              <p class="label-style mb-2">Last Name</p>
              <q-input
                :disable="!edit"
                v-model="customer.last_name"
                placeholder="Last Name"
                dense
                outlined
              />
            </div>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <div class="w-full">
              <p class="label-style mb-2">Email</p>
              <q-input
                :disable="!edit"
                v-model="customer.email"
                placeholder="Email"
                dense
                outlined
              />
            </div>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <div class="w-full">
              <p class="label-style mb-2">Language</p>
              <q-select
                outlined
                dense
                v-model="customer.language"
                use-input
                input-debounce="0"
                :options="languageOptions"
                @filter="filterLanguage"
                behavior="menu"
                :disable="!edit"
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
          <div class="col-span-2 sm:col-span-1">
            <div class="w-full">
              <p class="label-style mb-2">Country</p>
              <q-select
                outlined
                dense
                :disable="!edit"
                v-model="customer.country"
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
          <div class="col-span-2 sm:col-span-1">
            <div class="w-full">
              <p class="label-style mb-2">City</p>
              <q-input
                placeholder="City"
                v-model="customer.city"
                dense
                :disable="!edit"
                outlined
              />
            </div>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <div class="w-full">
              <p class="label-style mb-2">ZIP/Province</p>
              <q-input
                placeholder="ZIP/Province"
                v-model="customer.zip"
                dense
                :disable="!edit"
                outlined
              />
            </div>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <div class="w-full">
              <p class="label-style mb-2">Phone</p>
              <q-select
                outlined
                dense
                :disable="!edit"
                v-model="customer.phone"
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
          <div class="col-span-2 sm:col-span-1">
            <div class="w-full">
              <p class="label-style mb-2">Address 1</p>
              <q-input
                placeholder="Address 1"
                v-model="customer.address1"
                dense
                :disable="!edit"
                outlined
              />
            </div>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <div class="w-full">
              <p class="label-style mb-2">Address 2</p>
              <q-input
                placeholder="Address 2"
                v-model="customer.address2"
                dense
                :disable="!edit"
                outlined
              />
            </div>
          </div>
        </div>
        <div v-if="edit" class="flex justify-end mt-16 gap-3">
          <button
            @click="edit = !edit"
            :class="[
              `rounded-lg py-2 px-4 border-dotted border-2 ${
                edit
                  ? 'text-[#f44336] border-[#f44336]'
                  : 'text-primary border-primary'
              } `,
            ]"
          >
            Cancel
          </button>
          <button
            @click="edit = !edit"
            class="rounded-lg py-2 px-4 text-white bg-primary"
          >
            Save
          </button>
        </div>
      </div>
    </q-page-container>

    <q-drawer
      overlay
      :width="getWidth()"
      v-model="drawer"
      side="right"
    >
      <!-- drawer content -->
      <div class="h-full flex justify-center items-center">
        <div class="h-[90vh] w-full flex flex-col p-10">
          <div class="flex items-center justify-between">
            <div>
              <q-input placeholder="Search" v-model="search" dense outlined>
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <q-btn
              :disable="tableSelected.length == 0"
              round
              @click="selectedUser"
              color="primary"
              size="md"
              icon="done"
            />
          </div>
          <div class="mt-10">
            <q-table
              v-model:selected="tableSelected"
              :rows="getSelectedCustomers"
              :columns="tableHead"
              :filter="search"
              selection="single"
              row-key="fullName"
            />
          </div>
        </div>
      </div>

      <div class="absolute" style="top: 15px; left: -16px">
        <q-btn
          @click="drawer = false"
          dense
          round
          unelevated
          color="primary"
          icon="chevron_right"
        />
      </div>
    </q-drawer>
  </q-layout>
</template>

<style scoped></style>
