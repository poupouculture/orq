<template>
  <div class="main-container">
    <p class="header-text">Document Template ({{ titles[currentType] }})</p>
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
          @click="router.push(`/document-builders/${currentType}/create`)"
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
        <template #body-cell-name="props">
          <q-td :props="props">
            {{ props.row.name }}
          </q-td>
        </template>
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
          <q-td :props="props" class="flex gap-4 items-center">
            <router-link :to="`/document-builders/${props.row.id}`">
              <div><q-icon name="fa fa-edit" class="mr-1" />Edit</div>
            </router-link>
            <router-link
              :to="`/document-builders/${props.row.id}/preview`"
              style="text-decoration: none; color: inherit"
            >
              <div><q-icon name="fa fa-eye" class="mr-1" />Preview</div>
            </router-link>
            <button
              class="bg-primary text-white p-2 rounded-md"
              @click="activateTemplate(props.row.id)"
              v-if="props.row.status != 'active'"
            >
              <q-icon name="fa fa-check" />
              Activate
            </button>
          </q-td>
        </template>
      </BaseTable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { dateFormatter } from "src/helpers";
import BaseTable from "src/components/BaseTable.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";
import { DocumentLabels } from "src/types/DocumentBuilder";

import useDocumentTemplateStore from "src/stores/modules/documentTemplate";
import { storeToRefs } from "pinia";
const documentTemplateStore = useDocumentTemplateStore();
const { documentTemplates, meta } = storeToRefs(documentTemplateStore);

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

const titles = ref({
  invoice: DocumentLabels.INVOICE,
  sales_order: DocumentLabels.SALES_ORDER,
  purchase_order: DocumentLabels.PURCHASE_ORDER,
});

const currentType = ref("");

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
  await documentTemplateStore.getAllDocumentTemplates({
    type: currentType.value,
    limit: data.rowsPerPage,
    page: data.page,
    search: search.value,
  });
  data.applicationPrograms = documentTemplates;
  data.totalCount = meta?.filter_count;
  loading.value = false;
};

const changePage = (val) => {
  data.page = val;
  fetchApplicationPrograms();
};

const archiveSelected = () => {
  selected.value.forEach(async (data) => {
    data.status = "archived";
    await documentTemplateStore.updateDocumentTemplate(data.id, data, true);
  });

  fetchApplicationPrograms();
  selected.value = [];
};

const activateTemplate = async (id) => {
  loading.value = true;
  selected.value = [];
  await documentTemplateStore.activateDocumentTemplate(id, currentType.value);
  fetchApplicationPrograms();
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
  currentType.value = router.currentRoute.value.params.type;
  fetchApplicationPrograms();
});
</script>
<style scoped src="./style.scss" />
