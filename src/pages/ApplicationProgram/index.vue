<template>
  <div class="main-container">
    <p class="header-text">
      <span class="text-gray-400">
        <q-icon name="fa-solid fa-arrow-left" />
        Application program /
      </span>
      Message Templates
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
          @click="router.push('/application-program/create')"
        />
        <q-btn icon="delete" no-caps rounded label="Archive" />
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
          <template #body-cell-language="props">
            <q-td :props="props">
              {{ props.row.language }}
            </q-td>
          </template>
          <template #body-cell-delivered="props">
            <q-td :props="props">
              {{ props.row.delivered ? props.row.delivered : 0 }}
            </q-td>
          </template>
          <template #body-cell-read="props">
            <q-td :props="props">
              {{ props.row.read ? props.row.read : 0 }}
            </q-td>
          </template>
          <template #body-cell-replied="props">
            <q-td :props="props">
              {{ props.row.replied ? props.row.replied : 0 }}
            </q-td>
          </template>
          <template #body-cell-created_by="props">
            <q-td :props="props">
              {{ props.row.user_created }}
            </q-td>
          </template>
          <template #body-cell-created_on="props">
            <q-td :props="props">
              {{ props.row.date_created }}
            </q-td>
          </template>
          <template #body-cell-action="props">
            <q-td :props="props">
              <router-link
                :to="`/application-program/${props.row.id}`"
                style="text-decoration: none; color: inherit"
              >
                <p class="edit-button">Edit</p>
              </router-link>
            </q-td>
          </template>
          <template v-slot:bottom>
            <div
              class="row justify-between q-pt-lg q-pb-lg"
              style="width: 100%"
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
import { getApplicationPrograms } from "src/api/aplicationPrograms";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseTable from "src/components/BaseTable.vue";

import SubmenuFilter from "../../components/ApplicationProgram/SubmenuFilter.vue";

const router = useRouter();

const headerColumns = [
  {
    name: "name",
    align: "left",
    label: "Template Name",
    field: "name",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "status",
    align: "center",
    label: "Status",
    field: "status",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "language",
    align: "center",
    label: "Language",
    field: "language",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "delivered",
    align: "center",
    label: "Delivered",
    field: "delivered",
    classes: "text-black",
  },
  {
    name: "read",
    align: "center",
    label: "Read",
    field: "read",
    classes: "text-black",
  },
  {
    name: "replied",
    align: "center",
    label: "Replied",
    field: "replied",
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
  } = await getApplicationPrograms({
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
</script>

<style scoped src="./style.scss" />
