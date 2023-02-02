<template>
  <div class="main-container">
    <p class="header-text">
      <span class="text-gray-400">
        <q-icon name="fa-solid fa-arrow-left" />
      </span>
      Document Template
    </p>
    <div class="row justify-between">
      <q-input placeholder="Search" outlined dense>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <div>
        <q-btn
          icon="add"
          no-caps
          rounded
          color="primary"
          label="Add"
          class="q-mr-sm"
          @click="router.push('/document-builders/create')"
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
        :loading="false"
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
        <template #body-cell-action="props">
          <q-td :props="props">
            <router-link
              :to="`/document-builders/${props.row.id}`"
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
  getDocumentTemplates,
  updateDocumentTemplate,
} from "src/api/documentTemplate";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseTable from "src/components/BaseTable.vue";

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
    name: "invoice_currency",
    align: "center",
    label: "Currency",
    field: "invoice_currency",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "payment_methods",
    align: "center",
    label: "Payment Methods",
    field: "payment_methods",
    classes: "text-black",
  },
  {
    name: "fee_issued_to",
    align: "center",
    label: "Fee Issued To",
    field: "fee_issued_to",
    classes: "text-black",
  },
  {
    name: "user_created",
    align: "center",
    label: "Created By",
    field: "user_created",
    classes: "text-black",
  },
  {
    name: "date_created",
    align: "center",
    label: "Created On",
    field: "date_created",
    classes: "text-black",
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
const selected = ref([]);
const data = reactive({
  applicationPrograms: [],
  totalCount: 0,
  page: 1,
  rowsPerPage: 10,
});

onMounted(() => {
  fetchApplicationPrograms();
});
const fetchApplicationPrograms = async () => {
  const {
    data: { data: applicationPrograms, meta },
  } = await getDocumentTemplates({
    limit: data.rowsPerPage,
    page: data.page,
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
    await updateDocumentTemplate(data.id, data);
  });
};
</script>
<style scoped src="./style.scss" />
