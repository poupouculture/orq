<template>
  <q-table
    selection="multiple"
    :rows="rows"
    :columns="columns"
    :v-model:pagination="pagination"
    :rows-per-page-options="[10]"
    :row-key="rowKey"
    :loading="loading"
    v-model:selected="selected"
    flat
    :hide-pagination="hidePagination"
    binary-state-sort
    column-sort-order="ad"
    @row-click="onRowClick"
  >
    <template v-slot:header-selection v-if="props.disableSelect"> </template>
    <template v-slot:body-selection v-if="disableSelect"></template>
    <template #body-cell-date_created="props">
      <q-td :props="props">
        {{ dateFormatter(props.row.date_created) }}
      </q-td>
    </template>
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
    <template v-slot:bottom>
      <div
        class="grid grid-cols-1 py-3 lg:grid-cols-3 w-full items-center gap-4"
      >
        <div class="col-span-1 flex justify-center lg:justify-start">
          <p class="mb-0 text-sm text-[#757575]">
            {{ getPaginationLabel }}
          </p>
        </div>

        <div
          class="col-span-1 lg:col-span-2 flex justify-center lg:justify-end"
        >
          <q-pagination
            v-model="pagination.page"
            size="15px"
            @update:model-value="changePage"
            :max="totalPage"
            :max-pages="$q.screen.lt.lg ? 2 : 7"
            :direction-links="$q.screen.gt.sm"
            flat
            color="grey"
            active-color="primary"
          />
        </div>
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { dateFormatter } from "src/helpers";

const props = defineProps({
  selected: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  rowKey: {
    type: String,
    default: "id",
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  page: {
    type: Number,
    default: 1,
  },
  rowsPerPage: {
    type: Number,
    default: 10,
  },
  columns: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: true,
  },
  disableSelect: {
    type: Boolean,
    default: false,
  },
  hidePagination: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits([
  "changePage",
  "update:selected",
  "update:pagination",
]);
const selected = computed({
  set: (value) => emit("update:selected", value),
  get: () => props.selected,
});

const onRowClick = (e: any, row: any) => {
  const index = selected.value.findIndex((item: any) => item.id === row.id);
  console.log(index, row);
  if (index > -1) {
    selected.value.splice(index, 1);
  } else {
    selected.value.push(row);
  }
};

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: props.page,
  rowsPerPage: 10,
});

const getPaginationLabel = computed(() => {
  const max = props.page * props.rowsPerPage;
  const maxIndex = props.totalCount < max ? props.totalCount : max;
  const minIndex = props.rowsPerPage * (props.page - 1) + 1;

  return `Showing ${minIndex} to ${maxIndex} of
  ${props.totalCount} results`;
});

const totalPage = computed(() =>
  Math.ceil(props.totalCount / props.rowsPerPage)
);

const changePage = (page: number) => {
  emit("changePage", page);
};
</script>
