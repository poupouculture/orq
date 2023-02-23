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
            <th class="whitespace-nowrap px-5 py-4">
              <div>Status</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="hover:bg-primary/5 text-sm"
            v-for="(group, i) in data"
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
  selectedData: Array,
});
const emits = defineEmits(["submit", "changePage", "close"]);
const data = computed(() => props.data);
const pagination = computed(() => props.pagination);
const selectedUser = ref(props.selectedData || []);
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
const submit = () => {
  emits("submit", selectedUser.value);
};
const close = () => {
  emits("close");
};
const getPaginationLabel = () => {
  const max = pagination.value.page * pagination.value.rowsPerPage;
  const maxIndex =
    pagination.value.totalCount < max ? pagination.value.totalCount : max;
  const minIndex =
    pagination.value.rowsPerPage * (pagination.value.page - 1) + 1;

  return `Showing ${minIndex} to ${maxIndex} of
  ${pagination.value.totalCount} results`;
};

const changePage = (val) => {
  emits("changePage", val);
};
const totalPage = () => {
  return Math.ceil(pagination.value.totalCount / pagination.value.rowsPerPage);
};
</script>
