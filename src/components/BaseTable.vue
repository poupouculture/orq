<template>
  <q-table
    selection="multiple"
    :rows="rows"
    :columns="columns"
    v-model:pagination="pagination"
    :loading="loading"
    v-model:selected="selected"
    flat
  >
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
    <template v-slot:bottom>
      <div class="row justify-between q-pt-lg q-pb-lg" style="width: 100%">
        <div class="col">
          {{ getPaginationLabel() }}
        </div>
        <div class="col absolute-bottom-right q-ma-lg">
          <q-pagination
            :modelValue="props.page"
            @update:model-value="changePage"
            :max="totalPage()"
            direction-links
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
import { reactive, ref } from "vue";

const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
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
});
const emit = defineEmits(["changePage"]);

const selected = ref([]);
const pagination = reactive({
  sortBy: "desc",
  descending: false,
});

const getPaginationLabel = () => {
  const max = props.page * props.rowsPerPage;
  const maxIndex = props.totalCount < max ? props.totalCount : max;
  const minIndex = props.rowsPerPage * (props.page - 1) + 1;

  return `Showing ${minIndex} to ${maxIndex} of
  ${props.totalCount} results`;
};

const totalPage = () => {
  return Math.ceil(props.totalCount / props.rowsPerPage);
};

const changePage = (page: number) => {
  emit("changePage", page);
};
</script>
