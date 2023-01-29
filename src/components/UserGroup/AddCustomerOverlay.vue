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
        <q-btn @click="submit()" round color="primary" icon="check" />
      </div>
      <!-- Table data -->
      <div class="overflow-x-auto my-8">
        <table class="w-full">
          <thead>
            <tr class="text-left text-sm text-[#9A9AAF]">
              <th class="whitespace-nowrap px-5 py-4 w-10">
                <q-checkbox
                  size="xs"
                  v-model="selectAllCustomer"
                  :val="data.map((d) => d.id)"
                  class="text-[#9A9AAF]"
                />
              </th>
              <th class="whitespace-nowrap px-5 py-4">
                <div>Name</div>
              </th>
              <th class="whitespace-nowrap px-5 py-4">Companies</th>
              <th class="whitespace-nowrap px-5 py-4">
                <div>Customer Code</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="hover:bg-primary/5 text-sm"
              v-for="(customer, i) in data"
              :key="i"
            >
              <td class="whitespace-nowrap px-5 py-4 w-10">
                <q-checkbox
                  size="xs"
                  v-model="selectedCustomer"
                  :val="customer.id"
                  class="text-[#9A9AAF]"
                />
              </td>
              <td class="whitespace-nowrap px-5 py-4 w-10">
                <div class="flex items-center flex-nowrap">
                  <img
                    :src="
                      customer.avatar ||
                      'http://localhost:9000/src/assets/images/profileavatar.png'
                    "
                    class="w-10 h-10 rounded-full mr-3"
                  />
                  <div class="flex flex-col">
                    <p>{{ customer.first_name }} {{ customer.last_name }}</p>
                    <div class="space-x-2 text-sm text-[#9A9AAF]">
                      <span v-if="customer.gender">{{
                        gender(customer.gender)
                      }}</span>
                      <span v-if="customer.gender">|</span>
                      <span>{{ customer.date_created }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-5 py-4 w-10">
                {{ groupedCompanies(customer.companies) }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 w-10">
                {{ customer.customer_code }}
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
import { ref, computed } from "vue";
import BasePagination from "../BasePagination.vue";

const props = defineProps({
  data: Array,
  pagination: Object,
  selectedData: Array,
});
const data = computed(() => props.data);
const pagination = computed(() => props.pagination);
const emits = defineEmits(["submit", "changePage", "close"]);
const selectedCustomer = ref(props.selectedData || []);
const selectAllCustomer = computed({
  get: () =>
    data.value.length
      ? selectedCustomer.value.length === data.value.length
      : false,
  set: (value) => {
    const selected = [];
    if (value) {
      data.value.forEach(function (customer) {
        selected.push(customer.id);
      });
    }
    selectedCustomer.value = selected;
  },
});

const submit = () => {
  emits("submit", selectedCustomer.value);
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

const groupedCompanies = (companies) => {
  const grouped = companies.map((company) => company.companies_id.name_english);
  return grouped.join(", ");
};
const gender = (gender) => {
  let result;
  if (gender === "f") result = "Female";
  else if (gender === "m") result = "Male";
  return result;
};

const changePage = (val) => {
  emits("changePage", val);
};
const totalPage = () => {
  return Math.ceil(pagination.value.totalCount / pagination.value.rowsPerPage);
};
</script>
