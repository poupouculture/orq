<template>
  <div class="fixed w-full min-h-screen bg-black/50 z-[1000] top-0 bottom-0 right-0 flex justify-end"
    @click="$router.replace({ name: 'customergroups.create' })">
    <div class="w-8/12 h-full bg-white px-5 py-6 overflow-y-scroll" @click.stop>
      <div class="flex items-center justify-between">
        <div class="w-52 ml-3">
          <q-input placeholder="Search Items..." bg-color="transparent" outlined dense class="border-gray-400">
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
              <th class="whitespace-nowrap px-5 py-4 w-10 ">
                <q-checkbox size="xs" v-model="selectAllCustomer" :val="data.customers" class="text-[#9A9AAF]" />
              </th>
              <th class="whitespace-nowrap px-5 py-4">
                <div>Name</div>
              </th>
              <th class="whitespace-nowrap px-5 py-4">
                <div>Company</div>
              </th>
              <th class="whitespace-nowrap px-5 py-4">
                <div>Customer Code</div>
              </th>
              <th class="whitespace-nowrap px-5 py-4">
                <div>Label</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover:bg-primary/5 text-sm" v-for="(customer, i) in data.customers" :key="i">
              <td class="whitespace-nowrap px-5 py-4 w-10">
                <q-checkbox size="xs" v-model="selectedCustomer" :val="customer" class="text-[#9A9AAF]" />
              </td>
              <td class="whitespace-nowrap px-5 py-4 w-10">
                <div class="flex items-center flex-nowrap">
                  <img :src="customer.image || 'http://localhost:9000/src/assets/images/profileavatar.png'"
                    class="w-10 h-10 rounded-full mr-3" />
                  <div class="flex flex-col">
                    <p>{{ customer.first_name }} {{ customer.last_name }}</p>
                    <div class="space-x-2 text-sm text-[#9A9AAF]">
                      <span v-if="customer.gender">{{ gender(customer.gender) }}</span>
                      <span v-if="customer.gender">|</span>
                      <span>{{ customer.date_created }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-5 py-4 w-10">
                {{ groupedCompanies(customer.companies) }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 w-10">{{ customer.customer_code }}</td>
              <td class="whitespace-nowrap px-5 py-4 w-10">{{ customer.label }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="flex items-center justify-between pt-6 border-t">
        <div>{{ getPaginationLabel() }}</div>
        <BasePagination @update-model="changePage" :max="totalPage()" :max-pages="10" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { getCustomers } from 'src/api/customers';
import { ref, onMounted, reactive, computed, watch } from 'vue';
import BasePagination from '../BasePagination.vue';

const props = defineProps({
  modelValue: { type: Array }
})
const modelValue = computed(() => props.modelValue)
const emits = defineEmits(['update:modelValue'])
const selectedCustomer = ref([])
// when customer selected, update model value
watch(selectedCustomer, (val) => {
  emits('update:modelValue', val)
})
const selectAllCustomer = computed({
  get: () => data.customers.length ? selectedCustomer.value.length === data.customers.length : false,
  set: (value) => {
    const selected = [];
    if (value) {
      data.customers.forEach(function (customer) {
        selected.push(customer);
      });
    }
    selectedCustomer.value = selected;
  }
})
const data = reactive({
  customers: []
})
const loading = ref(false)
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
  fetchCustomers()
  if (modelValue.value) {
    selectedCustomer.value = modelValue.value
  }
})

const groupedCompanies = (companies) => {
  const grouped = companies.map((company) => company.companies_id.name_english);
  return grouped.join(", ");
};
const gender = (gender) => {
  let result;
  if (gender === "f") result = "Female"
  else if (gender === "m") result = "Male"
  return result
}
const fetchCustomers = async () => {
  const {
    data: { data: customers, meta },
  } = await getCustomers({
    limit: pagination.rowsPerPage,
    page: pagination.page,
  });
  data.customers = customers;
  pagination.totalCount = meta?.total_count;
  loading.value = false;
}
const changePage = (val) => {
  pagination.page = val;
  fetchCustomers({
    limit: pagination.rowsPerPage,
    page: pagination.page,
  });
};
const totalPage = () => {
  return Math.ceil(pagination.totalCount / pagination.rowsPerPage);
};
</script>
