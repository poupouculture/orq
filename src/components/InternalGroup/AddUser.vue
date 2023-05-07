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
    <template #body-cell-name="props">
      <q-td :props="props" :class="{ 'cursor-pointer': props.isSimple }">
        <div class="flex items-center flex-nowrap">
          <div class="flex flex-col">
            <p>{{ props.row.first_name }} {{ props.row.last_name }}</p>
          </div>
        </div>
      </q-td>
    </template>
    <template #body-cell-role="props">
      <q-td :props="props" :class="{ 'cursor-pointer': props.isSimple }">
        {{ props.row.role?.name }}
      </q-td>
    </template>
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
    label: "User Name",
    field: "name",
    classes: "text-black",
  },
  {
    name: "role",
    align: "left",
    label: "Role",
    field: "role",
    classes: "text-black",
  },
]);

const changePage = (val) => {
  emits("changePage", val);
};
</script>
