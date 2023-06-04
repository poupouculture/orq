<template>
  <div class="bg-[#F2F3F7] pb-3 pt-2 px-6 w-full rounded-md flex flex-col">
    <div
      class="flex items-center flex-nowrap space-x-2 mb-2 relative"
      v-if="openInfo"
    >
      <img :src="image" class="w-32" />
      <p class="sm:text-left text-sm text-[#6d6d74]">
        Please make sure that the customer information is filled for future auto
        loading of the customer information.
        <br />
        If the customer profile already exists, then search below.
      </p>

      <div
        class="absolute -right-2 top-3 cursor-pointer"
        @click="openInfo = false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M18 6l-12 12"></path>
          <path d="M6 6l12 12"></path>
        </svg>
      </div>
    </div>
    <div>Customer</div>
    <div class="rounded flex items-start pl-6 pr-2 py-2 bg-white mt-3 w-full">
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
      <div class="flex-1 relative mr-2">
        <input
          type="text"
          class="bg-transparent focus:outline-none pl-3 w-full"
          placeholder="Search ..."
          v-model="query"
          @keypress.enter="searchHandler()"
        />
        <div
          class="absolute -right-3 top-0.5 cursor-pointer"
          v-if="openSearchResult"
          @click="openSearchResult = false"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M18 6l-12 12"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </div>
        <div class="absolute -z-10">
          <q-menu :model-value="openSearchResult" :offset="[0, 10]" persistent>
            <q-list class="w-full">
              <q-item
                clickable
                v-for="(customer, i) in customers"
                :key="i"
                @click="selectCustomer(customer)"
              >
                <q-item-section>
                  {{ customer.customer_company_name_en }} -
                  {{ customer.customer_code }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </div>
      <div>
        <q-icon class="cursor-pointer" name="filter_list" size="1.2rem" />
        <q-menu fit anchor="bottom middle" self="top middle" :offset="[0, 10]">
          <div class="py-3 px-2">
            <ul class="max-w-sm space-y-3 w-80">
              <li
                class="py-1 px-3 bg-gray-100 rounded-lg flex items-center justify-between cursor-pointer flex-nowrap"
                v-for="(filter, index) in filterData"
                :key="filter.key"
              >
                <div
                  class="flex items-center space-x-2 w-full flex-nowrap overflow-x-auto"
                >
                  <span class="whitespace-nowrap">
                    {{ filter.label }}
                  </span>
                  <q-icon name="arrow_forward" />
                  <span class="font-bold whitespace-nowrap">
                    {{ printFilterBy(filter.filterBy) }}
                    <q-menu
                      fit
                      anchor="bottom middle"
                      self="top middle"
                      :offset="[0, 10]"
                      class="border"
                      dense
                      v-model="openFilterBy[index]"
                    >
                      <q-list style="min-width: 100px">
                        <q-item
                          clickable
                          v-for="filterBy in filterByMenus"
                          :key="filterBy.key"
                          @click="changeFilterBy(filterBy, index)"
                        >
                          <q-item-section>
                            {{ filterBy.label }}
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </span>
                  <input
                    type="text"
                    placeholder="- -"
                    @keyup.enter="loadFilter()"
                    v-model="filter.model"
                    class="bg-transparent border-none focus:outline-none w-full"
                  />
                </div>
                <q-icon
                  class="w-4"
                  name="close"
                  @click="removeFilterData(filter)"
                />
              </li>
              <li
                class="py-1 px-3 bg-gray-100 rounded-lg flex items-center justify-between cursor-pointer"
              >
                <span><q-icon name="add" /> Add Filter</span>
                <span>
                  <q-icon
                    class="transform transition-all"
                    :class="[{ 'rotate-180': addFilter }]"
                    name="expand_more"
                  />
                </span>
                <q-menu
                  fit
                  anchor="bottom middle"
                  self="top middle"
                  :offset="[0, 10]"
                  class="border py-1"
                  v-model="addFilter"
                >
                  <q-list dense>
                    <q-item
                      clickable
                      v-for="filter in filterMenus"
                      :key="filter.key"
                      :disabled="isDupliclateFilterMenu(filter)"
                      :class="{
                        'opacity-60': isDupliclateFilterMenu(filter),
                      }"
                      @click="pushFilterData(filter)"
                    >
                      <q-item-section>{{ filter.label }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </li>
            </ul>
          </div>
        </q-menu>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import type { Ref } from "vue";
import { debounce, Loading, Notify } from "quasar";
import { searchCustomers } from "src/api/customers";
import useCustomerStore from "src/stores/modules/customer";
import image from "src/assets/images/messaging-customer.png";

interface IFilterMenus {
  key: string;
  label: string;
  queryFilter: string;
  filterBy: string;
  model: string;
}
interface IFilterByMenus {
  key: string;
  label: string;
}
const filterData: Ref<IFilterMenus[]> = ref([]);
const filterMenus: Ref<IFilterByMenus[]> = ref([
  {
    key: "customer_code",
    label: "Customer Code",
    queryFilter: "[customer_code]",
    model: "",
    filterBy: "_contains",
  },
  {
    key: "location_code",
    label: "Location Code",
    queryFilter: "[location_code]",
    model: "",
    filterBy: "_contains",
  },
]);
const filterByMenus: Ref<IFilterByMenus[]> = ref([
  {
    key: "_contains",
    label: "Contains",
  },
  {
    key: "_eq",
    label: "Equals to",
  },
]);
const addFilter = ref(false);
const openFilterBy: Ref<boolean[]> = ref([]);
const loadFilter = () => {
  const results: {
    key: string;
    value: string;
  }[] = [];
  filterData.value.forEach((data: any, index: number) => {
    if (data.model) {
      results.push({
        key: `filter[_and][0][_and][${index}]${data.queryFilter}[${data.filterBy}]`,
        value: data.model,
      });
    }
  });
  searchHandler(results);
};
const pushFilterData = (data: any) => {
  addFilter.value = false;
  if (isDupliclateFilterMenu(data)) return;
  filterData.value.push({
    ...data,
    filterBy: "_contains",
  });
};
const changeFilterBy = (data: any, index: number) => {
  openFilterBy.value[index] = false;
  filterData.value[index] = {
    ...filterData.value[index],
    filterBy: data.key,
  };
};
const removeFilterData = (data: any) => {
  filterData.value = filterData.value.filter((d: any) => d.key !== data.key);
  loadFilter();
};
const printFilterBy = (key: string) => {
  return (
    filterByMenus.value.length && filterByMenus.value.length,
    filterByMenus.value.find((d: any) => d.key === key)?.label
  );
};
const isDupliclateFilterMenu = (data: any) => {
  return filterData.value.find((d: any) => d.key === data.key);
};
const customerStore = useCustomerStore();
interface IOption {
  label: string;
  key: string;
}
const query: Ref<string> = ref("");
const customers: Ref<any> = ref("");
const openInfo: Ref<boolean> = ref(true);
const customer: Ref<any> = ref(null);
const openCustomerFilter: Ref<boolean> = ref(false);
const openSearchResult: Ref<boolean> = ref(false);
const selectedOption: Ref<IOption> = ref({
  label: "Customer Name (English)",
  key: "customer_company_name_en",
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
const searchHandler = debounce(async function (filterQuery?: any) {
  Loading.show();
  try {
    let filter;
    if (query.value.length) {
      const key = `filter[${selectedOption.value.key}][_contains]`;
      filter = { [key]: query.value };
    }
    const params = {
      fields: "*",
      ...filter,
    } as any;
    if (filterQuery?.length) {
      filterQuery.forEach((data: any) => {
        params[data.key] = data.value;
      });
    }
    const { data } = await searchCustomers(params);
    if (data.data.length > 0) {
      openSearchResult.value = true;
      customers.value = data.data;
      console.log(222, data.data);
    } else {
      Notify.create({
        message: "No customer found.",
        position: "top",
      });
    }
  } catch (error) {}
  Loading.hide();
}, 300);
const filterOption = reactive<IOption[]>([
  {
    label: "Customer Code",
    key: "customer_code",
  },
  {
    label: "Customer Name (English)",
    key: "customer_company_name_en",
  },
  {
    label: "Customer Name (Chinese)",
    key: "customer_company_name_zht",
  },
  {
    label: "Division No",
    key: "div_no",
  },
  {
    label: "Salesman Code",
    key: "salesman_cd",
  },
  {
    label: "Location Code",
    key: "location_code",
  },
  {
    label: "First Name",
    key: "first_name",
  },
  {
    label: "Last Name",
    key: "last_name",
  },
]);
</script>
