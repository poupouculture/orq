<template>
  <div class="bg-[#F2F3F7] py-3 px-6 w-full rounded-md flex flex-col">
    <div>Customer</div>
    <div class="rounded flex items-start px-6 py-2 bg-white mt-3 w-full">
      <div class="flex items-center gap-x-2 border-r pr-3 cursor-pointer">
        <div>{{ selectedOption.label }}</div>
        <svg
          width="10"
          height="7"
          viewBox="0 0 10 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 4.22337L8.72727 0.157582L10 1.5459L5 7L0 1.5459L1.36364 0.157582L5 4.22337Z"
            fill="#9A9AAF"
          />
        </svg>
        <q-menu v-model="openCustomerFilter" :offset="[25, 10]" auto-close>
          <q-list class="w-36">
            <q-item
              clickable
              v-for="(option, i) in filterOption"
              :key="i"
              @click="selectOption(option)"
            >
              <q-item-section>{{ option.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
      <div class="flex-1">
        <input
          type="text"
          class="bg-transparent focus:outline-none pl-3 w-full"
          placeholder="Search ..."
          v-model="query"
          @keyup.enter="searchHandler()"
        />
        <q-menu v-model="openSearchResult" :offset="[0, 10]" auto-close>
          <q-list class="w-full">
            <q-item
              clickable
              v-for="(customer, i) in customers"
              :key="i"
              @click="selectCustomer(customer)"
            >
              <q-item-section>
                {{ customer.first_name }} {{ customer.last_name }} -
                {{ customer.customer_code }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import type { Ref } from "vue";
import { Loading, Notify } from "quasar";
import { searchCustomers } from "src/api/customers";
import useCustomerStore from "src/stores/modules/customer";

const customerStore = useCustomerStore();
interface IOption {
  label: string;
  key: string;
}
const query: Ref<string> = ref("");
const customers: Ref<any> = ref("");
const customer: Ref<any> = ref(null);
const openCustomerFilter: Ref<boolean> = ref(false);
const openSearchResult: Ref<boolean> = ref(false);
const selectedOption: Ref<IOption> = ref({
  label: "First Name",
  key: "first_name",
});
const selectOption = (option: IOption) => {
  selectedOption.value = option;
};
// the types will be fix later :)
const selectCustomer = (data: any) => {
  customer.value = data;
  openSearchResult.value = false;
  customerStore.$reset();
  if (data.id) {
    customerStore.fetchCustomer(data.id);
    query.value = "";
  }
};
// Search Handler
const searchHandler = async () => {
  if (!query.value.length) return;
  Loading.show();
  try {
    const key = `filter[${selectedOption.value.key}][_contains]`;
    const { data } = await searchCustomers({
      fields: "*",
      [key]: query.value,
    });
    if (data.data.length > 0) {
      openSearchResult.value = true;
      customers.value = data.data;
    } else {
      Notify.create({
        message: "No customer found.",
        position: "top",
      });
    }
  } catch (error) {}
  Loading.hide();
};
const filterOption = reactive<IOption[]>([
  {
    label: "First Name",
    key: "first_name",
  },
  {
    label: "Last Name",
    key: "last_name",
  },
  {
    label: "ID Number",
    key: "id_number",
  },
  {
    label: "Customer Code",
    key: "customer_code",
  },
]);
</script>
