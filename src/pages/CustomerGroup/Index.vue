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
        <div class="flex items-center justify-between space-x-3">
          <div class="w-52 ml-3">
            <SearchTableInput
              :loading="search.loading"
              @search="searchHandler"
              @reset="resetSearch"
            />
          </div>
          <q-select
            dense
            outlined
            v-model="sourceType"
            option-value="value"
            option-label="label"
            :options="sourceTypeOptions"
            map-options
            emit-value
            label="Source"
          />
        </div>
        <!-- <q-btn
          :to="{ name: 'customergroups.create' }"
          class="bg-primary text-white"
        >
          <q-icon name="add" class="text-white mr-2" />
          <span>Add</span>
        </q-btn> -->
      </div>
      <div
        class="flex items-center justify-center mt-4"
        v-if="customerGroups.length"
      >
        <BasePagination
          :max="totalPage()"
          :max-pages="10"
          @update-model="changePage"
          v-model="pagination.page"
        />
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
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <!-- Projects -->
          <div
            class="flex flex-col gap-y-2"
            v-for="group in customerGroups"
            :key="group.id"
          >
            <div
              class="rounded-lg w-full overflow-hidden border border-gray-200 bg-white"
            >
              <div
                class="bg-primary flex items-center justify-between text-white pl-3 py-0.5"
              >
                <div class="truncate w-10/12">{{ group.name }}</div>
                <ButtonGroupMenu
                  class="w-2/12 grow-0 justify-end"
                  :id="group.id"
                />
              </div>
              <div class="px-4 py-3 text-gray-500">
                <div class="flex items-center justify-between mb-2">
                  <p>Source</p>
                  <p class="text-gray-800">{{ group.source }}</p>
                </div>
                <div class="flex items-center justify-between">
                  <p>Total Members</p>
                  <p class="text-gray-800">{{ group.count }}</p>
                </div>
              </div>
            </div>
          </div>
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
import { onMounted, reactive, computed, ref, watch } from "vue";
import useCustomerGroupStore from "src/stores/modules/customerGroup";

const customerGroupStore = useCustomerGroupStore();
const customerGroups = computed(() => customerGroupStore.items);
const meta = computed(() => customerGroupStore.meta);
const loading = ref(false);
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 25,
});

const sourceType = ref("div_no");
const sourceTypeOptions = [
  { label: "div_no", value: "div_no" },
  { label: "salesman_code", value: "salesman_code" },
];
watch(sourceType, async () => {
  pagination.page = 1;
  customerGroupStore.setMeta({ ...pagination });
  await fetchCustomerGroups();
});

const search = reactive({
  query: "",
  loading: false,
});
const searchHandler = async (searchValue = "") => {
  search.query = searchValue;
  search.loading = true;
  try {
    pagination.page = 1;
    await fetchCustomerGroups();
    search.loading = false;
  } catch (error) {
    search.loading = false;
  }
};
const resetSearch = () => {
  search.query = "";
  searchHandler();
};

onMounted(async () => {
  loading.value = true;
  await fetchCustomerGroups();
  loading.value = false;
});

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
    sourceType: sourceType.value,
  });
};
</script>
