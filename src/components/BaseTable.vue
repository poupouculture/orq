<template>
  <q-table
    selection="multiple"
    :rows="rows"
    :columns="columns"
    :row-key="rowKey"
    v-model:pagination="pagination"
    :loading="loading"
    v-model:selected="selected"
    flat
    :hide-pagination="hidePagination"
    binary-state-sort
    column-sort-order="ad"
  >
    <template v-slot:header-selection v-if="disableSelect"> </template>
    <template v-slot:body-selection v-if="disableSelect"></template>
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
            v-model="page"
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

const props = defineProps({
  selected: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  rowKey: String,
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
const page = ref(props.page);
const selected = computed({
  set: (value) => emit("update:selected", value),
  get: () => props.selected,
});

const pagination = ref({
  sortBy: "",
  descending: false,
  page: page.value,
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
