<template>
  <div class="mt-8">
    <div class="flex items-cennter text-2xl space-x-2 font-semibold">
      <router-link :to="`/application-programs`">
        <span class="text-gray-400">
          <q-icon name="fa-solid fa-arrow-left" class="mr-2" />
          Application program
        </span>
      </router-link>
      <span>/</span>
      <span>Campaign</span>
    </div>
    <div class="row justify-between mt-6">
      <q-input placeholder="Search" outlined dense v-model="search.query">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <SearchTableInput
        :loading="loading"
        @search="searchHandler"
        @reset="resetSearch"
      />
      <!-- Search | Add | Archieve -->
      <div>
        <q-btn
          icon="add"
          no-caps
          color="primary"
          label="Add"
          class="q-mr-sm"
          @click="router.push('/application-programs/campaign/create')"
        />
        <q-btn icon="archive" no-caps label="Archive" />
      </div>
    </div>
    <!-- Table Data -->
    <div class="mt-6">
      <TableComponent
        :campaigns="data.campaigns"
        :totalCount="data.totalCount"
        :page="data.page"
        :rowsPerPage="data.rowsPerPage"
        v-model:selected="selected"
        @changePage="changePage"
        v-if="!loading"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCampaigns } from "src/api/campaign";
import TableComponent from "src/components/Compaign/TableComponent.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";

const router = useRouter();
const loading = ref(true);
const selected = ref([]);

const search = reactive({
  query: "",
});

const data = reactive({
  campaigns: [],
  totalCount: 0,
  page: 1,
  rowsPerPage: 10,
});

onMounted(async () => {
  await fetchCampaigns();
  loading.value = false;
});

const fetchCampaigns = async () => {
  const response = await getCampaigns({
    limit: data.rowsPerPage,
    page: data.page,
  });
  data.campaigns = response?.data.data;
  data.totalCount = response?.data.meta?.total_count;
  loading.value = false;
};

const changePage = (val: number) => {
  data.page = val;
  fetchCampaigns();
};

const searchHandler = (searchValue = "") => {
  search.query = searchValue;
  loading.value = true;
  fetchCampaigns();
};

const resetSearch = () => {
  search.query = "";
  searchHandler();
};
</script>
