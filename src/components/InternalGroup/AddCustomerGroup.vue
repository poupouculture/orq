<template>
  <TableData
    :header-columns="headerColumns"
    :pagination="pagination"
    :data="data"
    @change-page="changePage"
    v-model="selected"
    @search="emits('search', $event)"
    @submit="emits('submit', selected)"
    @close="emits('close')"
  >
    <template #header-search>
      <q-select
        dense
        outlined
        v-model="sourceType"
        :options="sourceTypeOptions"
        option-value="value"
        option-label="label"
        map-options
        emit-value
        label="Type"
      />
      <q-select
        dense
        outlined
        v-model="type"
        :options="typeOptions"
        option-value="value"
        option-label="label"
        map-options
        emit-value
        label="Type"
      />
    </template>
    <template #body-cell-name="props">
      <q-td :props="props" :class="{ 'cursor-pointer': props.isSimple }">
        {{ props.row.name }}
      </q-td>
    </template>
    <template #body-cell-status="props">
      <q-td :props="props" :class="{ 'cursor-pointer': props.isSimple }">
        {{ props.row.status }}
      </q-td>
    </template>
  </TableData>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import TableData from "src/components/Overlay/TableData.vue";

const emits = defineEmits([
  "submit",
  "changePage",
  "close",
  "search",
  "update:source",
  "update:type",
]);
const selected = ref([]);
const props = defineProps({
  pagination: Object,
  data: Array,
});
const sourceType = ref("div_no");
const sourceTypeOptions = [
  {
    label: "div_no",
    value: "div_no",
  },
  {
    label: "salesman_code",
    value: "salesman_code",
  },
];
const type = ref("group");
const typeOptions = [
  {
    label: "personal",
    value: "personal",
  },
  {
    label: "group",
    value: "group",
  },
];
watch(sourceType, () => {
  emits("update:source", sourceType.value);
});
watch(type, () => {
  emits("update:type", type.value);
});
const pagination = computed(() => props.pagination);
const data = computed(() => props.data);
const headerColumns = ref([
  {
    name: "name",
    align: "left",
    label: "Group Name",
    field: "name",
    classes: "text-black",
  },
  {
    name: "status",
    align: "left",
    label: "Status",
    field: "status",
    classes: "text-black",
  },
]);
const changePage = (val) => {
  emits("changePage", val);
};
</script>
