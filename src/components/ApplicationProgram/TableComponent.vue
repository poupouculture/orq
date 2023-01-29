<template>
  <BaseTable
    :rows="propsTable.applicationPrograms"
    :total-count="propsTable.totalCount"
    :page="propsTable.page"
    :rows-per-page="propsTable.rowsPerPage"
    :columns="headerColumns"
    :loading="false"
    v-model:selected="selected"
    @changePage="changePage"
  >
    <q-tr :props="props">
      <q-th v-for="col in props.cols" :key="col.name" :props="props" auto-width>
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
          :to="`/application-programs/message-templates/${props.row.id}`"
          style="text-decoration: none; color: inherit"
        >
          <p class="edit-button">Edit</p>
        </router-link>
      </q-td>
    </template>
  </BaseTable>
</template>

<script setup>
import { ref } from "vue";
import BaseTable from "src/components/BaseTable.vue";

const propsTable = defineProps({
  applicationPrograms: {
    type: Array,
    default: () => [],
  },
  totalCount: {
    type: Number,
    default: () => 0,
  },
  page: {
    type: Number,
    default: () => 0,
  },
  rowsPerPage: {
    type: Number,
    default: () => 0,
  },
});

const emit = defineEmits(["updateAction"]);

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

const selected = ref([]);

const changePage = (val) => {
  emit("changePage", val);
};
</script>
