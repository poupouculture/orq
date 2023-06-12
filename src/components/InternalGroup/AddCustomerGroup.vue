<template>
  <TableData
    :header-columns="headerColumns"
    :pagination="pagination"
    :data="data"
    label="Customer Groups"
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
        v-if="type === 'group'"
        v-model="sourceType"
        :options="sourceTypeOptions"
        option-value="value"
        option-label="label"
        map-options
        emit-value
        label="Source"
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
import {
  sourceOptionCG,
  typeOptions as TypeOptions,
} from "src/utils/typeOptions";

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
  source: String,
  type: String,
});
const sourceType = computed({
  set: (value) => emits("update:source", value),
  get: () => props.source,
});
const type = computed({
  set: (value) => emits("update:type", value),
  get: () => props.type,
});
watch(type, () => {
  if (type.value === "personal") {
    sourceType.value = "";
    sourceTypeOptions.value = [];
  } else {
    sourceType.value = "div_no";
    sourceTypeOptions.value = sourceOptionCG;
  }
});
const sourceTypeOptions = ref(sourceOptionCG);
const typeOptions = ref(TypeOptions);
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
]);
const changePage = (val) => {
  emits("changePage", val);
};
</script>
