<template>
  <TableData
    :header-columns="headerColumns"
    :pagination="pagination"
    :data="data"
    @change-page="changePage"
    v-model="selected"
    @search="emits('search', $event)"
    @submit="emits('submit', selected)"
    @close="emits('close')"
  >
    <template #body-cell-name="props">
      <q-td :props="props" :class="{ 'cursor-pointer': props.isSimple }">
        <div class="flex items-center flex-nowrap">
          <img
            :src="props.row.avatar || '/src/assets/images/profileicon.svg'"
            class="w-10 h-10 rounded-full mr-3"
          />
          <div class="flex flex-col">
            <p>{{ props.row.customer_company_name_en }}</p>
            <div class="space-x-2 text-sm text-[#9A9AAF]">
              <span v-if="props.row.gender">{{
                gender(props.row.gender)
              }}</span>
              <span v-if="props.row.gender">|</span>
              <span>{{ props.row.date_created }}</span>
            </div>
          </div>
        </div>
      </q-td>
    </template>
    <!-- <template #body-cell-companies="props">
      <q-td :props="props" :class="{ 'cursor-pointer': props.isSimple }">
        {{ groupedCompanies(props.row.companies) }}
      </q-td>
    </template> -->
    <template #body-cell-companies="props">
      <q-td :props="props" :class="{ 'cursor-pointer': props.isSimple }">
        {{ props.row.location_code }}
      </q-td>
    </template>
    <template #body-cell-customer_code="props">
      <q-td :props="props" :class="{ 'cursor-pointer': props.isSimple }">
        {{ props.row.customer_code }}
      </q-td>
    </template>
  </TableData>
</template>
<script setup>
import { ref, computed } from "vue";
import TableData from "src/components/Overlay/TableData.vue";

const emits = defineEmits(["submit", "changePage", "close", "search"]);
const selected = ref([]);
const props = defineProps({
  pagination: Object,
  data: Array,
});
const pagination = computed(() => props.pagination);
const data = computed(() => props.data);
const headerColumns = ref([
  {
    name: "name",
    align: "left",
    label: "Customer Name",
    field: "name",
    classes: "text-black",
  },
  {
    name: "location_code",
    align: "left",
    label: "Location Code",
    field: "location_code",
    classes: "text-black",
  },
  // {
  //   name: "companies",
  //   align: "left",
  //   label: "Companies",
  //   field: "companies",
  //   classes: "text-black",
  // },
  {
    name: "customer_code",
    align: "left",
    label: "Customer Code",
    field: "customer_code",
    classes: "text-black",
  },
]);
// const groupedCompanies = (companies) => {
//   const grouped = companies.map((company) => company.companies_id.name_english);
//   return grouped.join(", ");
// };
const gender = (gender) => {
  let result;
  if (gender === "f") result = "Female";
  else if (gender === "m") result = "Male";
  return result;
};

const changePage = (val) => {
  emits("changePage", val);
};
</script>
