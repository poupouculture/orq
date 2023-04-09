<template>
  <div class="main-container">
    <p class="header-text">Master Components</p>
    <div class="row justify-between">
      <SearchTableInput
        :loading="loading"
        @search="searchHandler"
        @reset="resetSearch"
      />
      <div>
        <q-btn
          icon="add"
          no-caps
          rounded
          color="primary"
          label="Add"
          class="q-mr-sm"
          @click="router.push('/document-components/create')"
        />
        <q-btn
          icon="archive"
          no-caps
          rounded
          label="Archive"
          @click="archiveSelected"
        />
      </div>
    </div>
    <div class="main-content">
      <BaseTable
        :rows="data.applicationPrograms"
        :total-count="data.totalCount"
        :page="data.page"
        :rows-per-page="data.rowsPerPage"
        :columns="headerColumns"
        :loading="loading"
        v-model:selected="selected"
        @changePage="changePage"
      >
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            auto-width
          >
            {{ col.label }}
          </q-th>
        </q-tr>
        <template #body-cell-status="props">
          <q-td :props="props">
            <span
              class="text-xs font-semibold py-1 px-2 rounded text-[#70CC6B] bg-green-200"
            >
              {{ props.row.status }}
            </span>
          </q-td>
        </template>
        <template #body-cell-date_created="props">
          <q-td :props="props">
            {{ dateFormatter(props.row.date_created) }}
          </q-td>
        </template>
        <template #body-cell-action="props">
          <q-td :props="props">
            <router-link
              :to="`/document-components/${props.row.id}`"
              style="text-decoration: none; color: inherit"
            >
              <p class="edit-button">Edit</p>
            </router-link>
          </q-td>
        </template>
      </BaseTable>
    </div>
  </div>
</template>

<script setup>
import {
  getDocumentComponents,
  updateDocumentComponent,
} from "src/api/documentComponents";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { dateFormatter } from "src/helpers";
import BaseTable from "src/components/BaseTable.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";

const router = useRouter();

const headerColumns = [
  {
    name: "status",
    align: "center",
    label: "Status",
    field: "status",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "name",
    align: "center",
    label: "Name",
    field: "name",
    classes: "text-black",
  },
  {
    name: "type",
    align: "center",
    label: "Type",
    field: "type",
    classes: "text-black",
  },
  {
    name: "date_created",
    align: "center",
    label: "Created On",
    field: "date_created",
    classes: "text-black",
    sortable: true,
  },
  {
    name: "action",
    align: "center",
    label: "",
    field: "action",
    classes: "text-blue",
  },
];

const loading = ref(true);
const search = ref("");
const selected = ref([]);
const data = reactive({
  applicationPrograms: [],
  totalCount: 0,
  page: 1,
  rowsPerPage: 10,
});

const fetchApplicationPrograms = async () => {
  const {
    data: { data: applicationPrograms, meta },
  } = await getDocumentComponents({
    limit: data.rowsPerPage,
    page: data.page,
    search: search.value,
  });
  data.applicationPrograms = applicationPrograms;
  data.totalCount = meta?.total_count;
  loading.value = false;
};

const changePage = (val) => {
  data.page = val;
  fetchApplicationPrograms();
};

const archiveSelected = () => {
  selected.value.forEach(async (data) => {
    data.status = "archive";
    await updateDocumentComponent(data.id, data);
  });
};

const searchHandler = (searchValue = "") => {
  search.value = searchValue;
  loading.value = true;
  fetchApplicationPrograms();
};

const resetSearch = () => {
  search.value = "";
  searchHandler();
};

onMounted(() => {
  fetchApplicationPrograms();
});
</script>
<style scoped src="../style.scss" />
