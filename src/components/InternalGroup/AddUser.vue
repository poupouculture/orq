<template>
  <RightToLeft @submit="submit" @close="close">
    <!-- Table data -->
    <div class="overflow-x-auto my-8">
      <table class="w-full">
        <thead>
          <tr class="text-left text-sm text-[#9A9AAF]">
            <th class="whitespace-nowrap px-5 py-4 w-10">
              <q-checkbox
                size="xs"
                v-model="selectAllUser"
                :val="data"
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
            v-for="(user, i) in data"
            :key="i"
          >
            <td class="whitespace-nowrap px-5 py-4 w-10">
              <q-checkbox
                size="xs"
                v-model="selectedUser"
                :val="user"
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
        v-model="pagination.page"
      />
    </div>
  </RightToLeft>
</template>
<script setup>
import { ref, computed } from "vue";
import BasePagination from "src/components/BasePagination.vue";
import RightToLeft from "src/components/Overlay/RightToLeft.vue";

const props = defineProps({
  data: Array,
  pagination: Object,
});
const data = computed(() => props.data);
const pagination = computed(() => props.pagination);
const emits = defineEmits(["submit", "changePage", "close"]);
const selectedUser = ref([]);

const selectAllUser = computed({
  get: () =>
    data.value.length ? selectedUser.value.length === data.value.length : false,
  set: (value) => {
    const selected = [];
    if (value) {
      data.value.forEach(function (user) {
        selected.push(user);
      });
    }
    selectedUser.value = selected;
  },
});

const getPaginationLabel = () => {
  const max = pagination.value.page * pagination.value.rowsPerPage;
  const maxIndex =
    pagination.value.filterCount < max ? pagination.value.filterCount : max;
  const minIndex =
    pagination.value.rowsPerPage * (pagination.value.page - 1) + 1;

  return `Showing ${minIndex} to ${maxIndex} of
  ${pagination.value.filterCount} results`;
};

const submit = () => {
  emits("submit", selectedUser.value);
};
const close = () => {
  emits("close");
};
const changePage = (val) => {
  emits("changePage", val);
};
const totalPage = () => {
  return Math.ceil(pagination.value.filterCount / pagination.value.rowsPerPage);
};
</script>
