<template>
  <RightToLeft :close="closeOverlay" @close="emits('close')">
    <div class="px-0 md:px-3 mb-3 text-lg font-semibold" v-if="label">
      {{ label }}
    </div>
    <div
      class="px-0 md:px-3 flex items-center gap-x-3 sm:justify-between gap-y-2"
    >
      <div class="flex items-center gap-2">
        <div class="w-52">
          <q-input
            placeholder="Search Items..."
            bg-color="transparent"
            outlined
            dense
            :debounce="600"
            class="border-gray-400"
            v-model="search.query"
            @keyup.enter="searchHandler()"
          >
            <template v-slot:prepend>
              <q-icon name="search" class="text-gray-400" />
            </template>
            <template v-slot:append>
              <q-circular-progress
                v-if="search.loading"
                indeterminate
                rounded
                size="18px"
                color="gray-1"
              />
              <q-icon
                v-else-if="search.query"
                name="close"
                class="text-gray-400 cursor-pointer"
                @click="resetSearch()"
              />
              <q-icon v-else name="filter_list" class="text-gray-400" />
            </template>
          </q-input>
        </div>
        <slot name="header-search"></slot>
      </div>
      <q-btn @click="submit()" round color="primary" icon="check" />
    </div>
    <!-- Table data -->
    <div class="overflow-x-auto my-8">
      <BaseTable
        v-if="data.length"
        :rows="data"
        :total-count="pagination.totalCount"
        :page="pagination.page"
        :rows-per-page="pagination.rowsPerPage"
        :columns="headerColumns"
        :loading="false"
        :disable-select="isSimple"
        v-model:selected="selectedData"
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
            {{ $slots }}
          </q-th>
        </q-tr>
        <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </BaseTable>
      <div v-else class="text-center text-gray-700">
        <div class="text-lg">No data found</div>
        <template v-if="isSearch">
          <div class="text-gray-500 mb-2">
            Adjust or clear search filters to see results.
          </div>
          <q-btn @click="resetSearch()" color="primary" size="sm"
            >Clear filter</q-btn
          >
        </template>
      </div>
    </div>
  </RightToLeft>
</template>
<script setup>
import { ref, computed, reactive } from "vue";
import RightToLeft from "src/components/Overlay/RightToLeft.vue";
import BaseTable from "src/components/BaseTable.vue";

const props = defineProps({
  data: Array,
  label: String,
  modelValue: {
    type: Array,
    default: () => [],
  },
  pagination: Object,
  headerColumns: {
    type: Array,
    default: () => [],
  },
  isSimple: {
    type: Boolean,
    default: () => false,
  },
});
const emits = defineEmits([
  "submit",
  "changePage",
  "close",
  "search",
  "update:modelValue",
  "sourceType",
]);
const data = computed(() => props.data);
const pagination = computed(() => props.pagination);
const isSearch = ref(false);
const closeOverlay = ref(false);
const selectedData = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});

const search = reactive({
  loading: false,
  query: "",
});

const searchHandler = async () => {
  emits("search", search.query);
};
const resetSearch = () => {
  search.query = "";
  searchHandler();
};

const submit = () => {
  closeOverlay.value = true;
  emits("submit");
};
const changePage = (val) => {
  emits("changePage", val);
};
</script>
