<template>
  <div
    class="fixed w-full min-h-screen bg-black/50 z-[1000] top-0 bottom-0 right-0 flex justify-end"
    @click="close()"
  >
    <div class="w-8/12 h-full bg-white px-5 py-6 overflow-y-scroll" @click.stop>
      <div class="flex items-center justify-between">
        <div class="w-52 ml-3">
          <q-input
            placeholder="Search Items..."
            bg-color="transparent"
            outlined
            dense
            class="border-gray-400"
          >
            <template v-slot:prepend>
              <q-icon name="search" class="text-gray-400" />
            </template>
            <template v-slot:append>
              <q-icon name="filter_list" class="text-gray-400" />
            </template>
          </q-input>
        </div>
        <q-btn @click="close()" round color="primary" icon="check" />
      </div>
      <!-- Table data -->
      <div class="overflow-x-auto my-8">
        <table class="w-full">
          <thead>
            <tr class="text-left text-sm text-[#9A9AAF]">
              <th class="whitespace-nowrap px-5 py-4 w-10">
                <q-checkbox
                  size="xs"
                  v-model="selectAllCustomerGroups"
                  val="xs"
                  class="text-[#9A9AAF]"
                />
              </th>
              <th class="whitespace-nowrap px-5 py-4">
                <div>Name</div>
              </th>
              <th class="whitespace-nowrap px-5 py-4">
                <div>Status</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="hover:bg-primary/5 text-sm"
              v-for="(group, i) in data.customerGroups"
              :key="i"
            >
              <td class="whitespace-nowrap px-5 py-4 w-10">
                <q-checkbox
                  size="xs"
                  v-model="selectedCustomerGroup"
                  :val="group.id"
                  class="text-[#9A9AAF]"
                />
              </td>
              <td class="whitespace-nowrap px-5 py-4 w-10">
                <p>{{ group.name }}</p>
              </td>
              <td class="whitespace-nowrap px-5 py-4 w-10">
                {{ group.status }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="flex items-center justify-between pt-6 border-t">
        <div>{{ getPaginationLabel() }}</div>
        <BasePagination
          @update-model="changePage"
          :max="totalPage()"
          :max-pages="10"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { getCustomerGroups } from "src/api/customerGroup";
import { ref, onMounted, reactive, computed, watch } from "vue";
import BasePagination from "../BasePagination.vue";

const props = defineProps({
  modelValue: { type: Array },
});
const modelValue = computed(() => props.modelValue);
const emits = defineEmits(["update:modelValue", ".lengthclose"]);
const selectedCustomerGroup = ref([]);
// when user selected, update model.length.id ? model.length.id value : model.length.includes(group.id)
watch(selectedCustomerGroup, (val) => {
  emits("update:modelValue", val);
});
const selectAllCustomerGroups = computed({
  get: () =>
    data.customerGroups.length
      ? selectedCustomerGroup.value.length === data.customerGroups.length
      : false,
  set: (value) => {
    const selected = [];
    if (value) {
      data.customerGroups.forEach(function (customerGroup) {
        selected.push(customerGroup);
      });
    }
    selectedCustomerGroup.value = selected;
  },
});
const close = () => {
  emits("close");
};
const data = reactive({
  customerGroups: [],
});
const loading = ref(false);
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  totalCount: 0,
});
const getPaginationLabel = () => {
  const max = pagination.page * pagination.rowsPerPage;
  const maxIndex = pagination.totalCount < max ? pagination.totalCount : max;
  const minIndex = pagination.rowsPerPage * (pagination.page - 1) + 1;

  return `Showing ${minIndex} to ${maxIndex} of
  ${pagination.totalCount} results`;
};
onMounted(async () => {
  await fetchCustomerGroup();
  if (modelValue.value.length) {
    selectedCustomerGroup.value = data.customerGroups
      .filter((group) => modelValue.value.includes(group.id))
      .map((item) => item.id);
  }
});

const fetchCustomerGroup = async () => {
  const {
    data: { data: customerGroups, meta },
  } = await getCustomerGroups({
    limit: pagination.rowsPerPage,
    page: pagination.page,
  });
  data.customerGroups = customerGroups;
  pagination.totalCount = meta?.total_count;
  loading.value = false;
};
const changePage = (val) => {
  pagination.page = val;
  fetchCustomerGroup({
    limit: pagination.rowsPerPage,
    page: pagination.page,
  });
};
const totalPage = () => {
  return Math.ceil(pagination.totalCount / pagination.rowsPerPage);
};
</script>
