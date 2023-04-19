<template>
  <div>
    <div class="pt-10 min-h-screen">
      <!-- Heading -->
      <div
        class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5"
      >
        <q-icon name="keyboard_backspace" />
        <span>Customer Groups</span>
      </div>
      <!-- Search and Add -->
      <div class="flex items-center justify-between">
        <div class="w-52 ml-3">
          <SearchTableInput
            :loading="search.loading"
            @search="searchHandler"
            @reset="resetSearch"
          />
        </div>
        <q-btn
          :to="{ name: 'customergroups.create' }"
          class="bg-primary text-white"
        >
          <q-icon name="add" class="text-white mr-2" />
          <span>Add</span>
        </q-btn>
      </div>
      <!-- Content -->
      <h5 class="uppercase mt-6 text-gray-500">Pinned</h5>
      <div v-if="loading" class="flex justify-center">
        <q-circular-progress
          indeterminate
          rounded
          size="30px"
          color="primary"
        />
      </div>
      <template v-else-if="customerGroups.length">
        <div class="grid lg:grid-cols-4 gap-4">
          <!-- Projects -->
          <div
            class="flex flex-col gap-y-2"
            v-for="group in customerGroups"
            :key="group.name"
          >
            <div
              class="flex flex-row justify-between h-16 rounded-lg overflow-hidden bg-white border-gray-300 border shrink-0 w-full"
            >
              <div
                class="flex items-center w-10/12 flex-nowrap overflow-x-hidden"
              >
                <div
                  class="w-16 h-16 items-center justify-center flex text-white mr-3 bg-primary text-xs px-2 text-center"
                >
                  {{ group.name }}
                </div>
                <div class="truncate">
                  <div class="truncate">{{ group.name }}</div>
                  <p class="text-gray-400">
                    {{ group.customers.length }} Members
                  </p>
                </div>
              </div>
              <ButtonGroupMenu
                class="w-2/12 grow-0 justify-end"
                :id="group.id"
                @add-customer="fetchCustomerGroups()"
              />
            </div>
            <!-- Customers -->
            <div
              class="flex flex-row justify-between h-16 rounded-lg overflow-hidden bg-white border-gray-300 border shrink-0 w-full"
              v-for="{ customers_id } in group.customers.filter(
                (item) => item.customers_id !== null
              )"
              :key="customers_id.id"
            >
              <div
                class="flex items-center w-10/12 flex-nowrap overflow-x-hidden"
              >
                <!-- for while set image default -->
                <img
                  :src="
                    customers_id.avatar || 'src/assets/images/profileavatar.png'
                  "
                  class="w-10 h-10 rounded-full mx-3"
                />
                <div class="truncate">
                  <div class="relative truncate">
                    {{ customers_id.customer_company_name_en }}
                    <span
                      v-if="group.name == 'VIP'"
                      class="absolute top-0 -right-10 bg-primary rounded-xl text-white px-2 py-0.5 text-xs"
                      >VIP</span
                    >
                  </div>
                  <div class="text-gray-400 cursor-pointer truncate">
                    {{ customers_id.position }}
                  </div>
                </div>
              </div>
              <div class="flex items-center w-2/12 grow-0 justify-end">
                <ButtonCustomerMenu
                  :id="group.id"
                  :customer-id="customers_id.id"
                  :pagination="pagination"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center mt-20">
          <BasePagination
            :max="totalPage()"
            :max-pages="10"
            @update-model="changePage"
            v-model="pagination.page"
          />
        </div>
      </template>
      <div v-else class="text-center text-gray-700">
        <div class="text-lg">No data found</div>
        <template v-if="search.query">
          <div class="text-gray-500 mb-2">
            Adjust or clear search filters to see results.
          </div>
          <q-btn @click="resetSearch()" color="primary" size="sm"
            >Clear filter</q-btn
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonGroupMenu from "components/UserGroup/ButtonGroupMenu.vue";
import BasePagination from "components/BasePagination.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";
import { onMounted, reactive, computed, ref } from "vue";
import useCustomerGroupStore from "src/stores/modules/customerGroup";
import ButtonCustomerMenu from "src/components/UserGroup/ButtonCustomerMenu.vue";

const customerGroupStore = useCustomerGroupStore();
const customerGroups = computed(() => customerGroupStore.items);
const meta = computed(() => customerGroupStore.meta);
const loading = ref(false);
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 4,
});
onMounted(async () => {
  loading.value = true;
  await fetchCustomerGroups();
  loading.value = false;
});

const search = reactive({
  query: "",
  loading: false,
});
const searchHandler = async (searchValue = "") => {
  search.query = searchValue;
  search.loading = true;
  try {
    await customerGroupStore.getAll({
      rowsPerPage: 4,
      page: 1,
      search: search.query.length ? search.query : undefined,
      type: "group",
    });
    search.loading = false;
  } catch (error) {
    search.loading = false;
  }
};
const resetSearch = () => {
  search.query = "";
  searchHandler();
};

const totalPage = () => {
  return Math.ceil(meta.value.filter_count / pagination.rowsPerPage);
};
const changePage = async (val) => {
  pagination.page = val;
  await fetchCustomerGroups();
  customerGroupStore.setMeta({ ...pagination });
};

const fetchCustomerGroups = async () => {
  await customerGroupStore.getAll({
    rowsPerPage: pagination.rowsPerPage,
    page: pagination.page,
    search: search.query.length ? search.query : undefined,
    type: "group",
  });
};
</script>
