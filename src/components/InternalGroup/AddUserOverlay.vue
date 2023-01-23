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
                  v-model="selectAllUser"
                  :val="data.users"
                  class="text-[#9A9AAF]"
                />
              </th>
              <th class="whitespace-nowrap px-5 py-4">
                <div>Name</div>
              </th>
              <th class="whitespace-nowrap px-5 py-4">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="hover:bg-primary/5 text-sm"
              v-for="(user, i) in data.users"
              :key="i"
            >
              <td class="whitespace-nowrap px-5 py-4 w-10">
                <q-checkbox
                  size="xs"
                  v-model="selectedUser"
                  :val="user.id"
                  class="text-[#9A9AAF]"
                />
              </td>
              <td class="whitespace-nowrap px-5 py-4 w-10">
                <div class="flex items-center flex-nowrap">
                  <img
                    :src="
                      user.avatar ||
                      'http://localhost:9000/src/assets/images/profileavatar.png'
                    "
                    class="w-10 h-10 rounded-full mr-3"
                  />
                  <div class="flex flex-col">
                    <p>{{ user.first_name }} {{ user.last_name }}</p>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-5 py-4 w-10">
                {{ user.role?.name }}
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
import { getUsers } from "src/api/user";
import { ref, onMounted, reactive, computed, watch } from "vue";
import BasePagination from "../BasePagination.vue";

const props = defineProps({
  modelValue: { type: Array },
});
const modelValue = computed(() => props.modelValue);
const emits = defineEmits(["update:modelValue", "close"]);
const selectedUser = ref([]);
const data = reactive({
  users: [],
});
// when customer selected, update model value
watch(selectedUser, (val) => {
  emits("update:modelValue", val);
});
const close = () => {
  emits("close");
};
const selectAllUser = computed({
  get: () =>
    data.users.length ? selectedUser.value.length === data.users.length : false,
  set: (value) => {
    const selected = [];
    if (value) {
      data.users.forEach(function (user) {
        selected.push(user);
      });
    }
    selectedUser.value = selected;
  },
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
  await fetchUsers();
  if (modelValue.value.length) {
    selectedUser.value = data.users
      .filter((group) => modelValue.value.includes(group.id))
      .map((item) => item.id);
  }
});
const fetchUsers = async () => {
  const {
    data: { data: users, meta },
  } = await getUsers({
    limit: pagination.rowsPerPage,
    page: pagination.page,
  });
  data.users = users;
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
