<template>
  <div
    class="fixed w-full min-h-screen bg-black/50 z-[1000] top-0 bottom-0 right-0 flex justify-end"
    @click="$router.replace({ name: 'customergroups.create' })"
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
        <RouterLink :to="{ name: 'customergroups.create' }" replace>
          <q-icon name="close" size="1.5rem" />
        </RouterLink>
      </div>
      <!-- Table data -->
      <div class="overflow-x-auto my-8">
        <table class="w-full">
          <thead>
            <tr class="text-left text-sm text-[#9A9AAF]">
              <th class="whitespace-nowrap px-5 py-4 w-10">
                <q-checkbox
                  size="xs"
                  v-model="selectAllUser"
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
              v-for="(group, i) in data.userGroups"
              :key="i"
            >
              <td class="whitespace-nowrap px-5 py-4 w-10">
                <q-checkbox
                  size="xs"
                  v-model="selectedUser"
                  :val="group"
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
import { getUserGroups } from "src/api/userGroup";
import { ref, onMounted, reactive, computed, watch } from "vue";
import BasePagination from "../BasePagination.vue";

const props = defineProps({
  modelValue: { type: Array },
});
const modelValue = computed(() => props.modelValue);
const emits = defineEmits(["update:modelValue"]);
const selectedUser = ref([]);
// when user selected, update model value
watch(selectedUser, (val) => {
  emits("update:modelValue", val);
});
const selectAllUser = computed({
  get: () =>
    data.userGroups.length
      ? selectedUser.value.length === data.userGroups.length
      : false,
  set: (value) => {
    const selected = [];
    if (value) {
      data.userGroups.forEach(function (user) {
        selected.push(user);
      });
    }
    selectedUser.value = selected;
  },
});
const data = reactive({
  userGroups: [],
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
onMounted(() => {
  fetchUsers();
  if (modelValue.value) {
    selectedUser.value = modelValue.value;
  }
});

const fetchUsers = async () => {
  const {
    data: { data: userGroups, meta },
  } = await getUserGroups({
    limit: pagination.rowsPerPage,
    page: pagination.page,
  });
  data.userGroups = userGroups;
  pagination.totalCount = meta?.total_count;
  loading.value = false;
};
const changePage = (val) => {
  pagination.page = val;
  fetchUsers({
    limit: pagination.rowsPerPage,
    page: pagination.page,
  });
};
const totalPage = () => {
  return Math.ceil(pagination.totalCount / pagination.rowsPerPage);
};
</script>
