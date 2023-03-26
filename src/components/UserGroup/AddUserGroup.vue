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
  </TableData>
</template>
<script setup>
import { ref, computed } from "vue";
import TableData from "src/components/Overlay/TableData.vue";

const emits = defineEmits(["submit", "changePage", "close", "search"]);
const selected = ref([]);
const props = defineProps({
  pagination: Object,
  data: Array,
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
