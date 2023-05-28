<template>
  <q-dialog :modelValue="modelValue" @hide="hide">
    <q-card
      style="min-width: 85%; min-height: 85%"
      class="q-pa-lg flex flex-col"
    >
      <q-card-section>
        <div class="flex justify-between">
          <p class="text-lg mb-2">Profile</p>
          <q-icon name="close" class="cursor-pointer" @click="hide" />
        </div>

        <div class="row justify-between">
          <q-input
            v-model="search"
            @change="handleSearch"
            @keypress.enter.prevent="handleSearch"
            placeholder="Search Profile..."
            outlined
            dense
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </q-card-section>
      <div class="w-full h-10">
        <q-card-section>
          <BaseTable
            :rows="data.customers"
            :total-count="data.totalCount"
            :page="data.page"
            :rows-per-page="data.rowsPerPage"
            :columns="headerColumns"
            :loading="loading"
            :disable-select="true"
            @changePage="changePage"
          >
            <template #body-cell-name="props">
              <q-td :props="props" auto-width>
                <div class="firstrowholder">
                  <div class="subrow">
                    <p class="headingtext">
                      {{ props.row.first_name }}
                      {{ props.row.last_name }}
                    </p>
                  </div>
                </div>
                <p></p>
              </q-td>
            </template>
            <template #body-cell-company="props">
              <q-td :props="props">
                {{ groupedCompanies(props.row.companies) }}
              </q-td>
            </template>
            <template #body-cell-customerCode="props">
              <q-td :props="props">
                {{ props.row.customer_code }}
              </q-td>
            </template>
            <template #body-cell-action="props">
              <q-td :props="props">
                <button
                  class="px-4 py-2 rounded-md bg-primary text-white"
                  @click="chooseCustomer(props.row)"
                >
                  Choose
                </button>
              </q-td>
            </template>
          </BaseTable>
          <div class="w-full flex justify-end mt-4">
            <button class="btn-dotted" @click="hide">Close</button>
          </div>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { getCustomersWithContacts } from "src/api/customers";
import BaseTable from "src/components/BaseTable.vue";
import { Notify } from "quasar";

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["hide", "submit"]);

const headerColumns = [
  {
    name: "customer_company_name_en",
    align: "left",
    label: "Profile Name(English)",
    field: "customer_company_name_en",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "first_name",
    align: "left",
    label: "Firstname",
    field: "first_name",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "contact_number",
    align: "left",
    label: "Contact Number",
    field: "contact_number",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "customerCode",
    align: "left",
    label: "Profile Code",
    field: "customerCode",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "location_code",
    align: "left",
    label: "Location Code",
    field: "location_code",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "action",
    align: "center",
    label: "Action",
    field: "action",
    classes: "text-blue",
  },
  {
    name: "company",
    align: "left",
    label: "Company",
    field: "company",
    sortable: true,
    classes: "text-black",
  },
];
const loading = ref(true);
const data = reactive({
  customers: [],
  totalCount: 0,
  page: 1,
  rowsPerPage: 10,
});
const search = ref("");

const groupedCompanies = (companies) => {
  const grouped = companies.map((company) => company.name);
  return grouped.join(", ");
};

const fetchCustomers = async () => {
  try {
    const {
      data: { data: customers },
    } = await getCustomersWithContacts({
      limit: data.rowsPerPage,
      page: data.page,
      search: search.value,
    });

    data.customers = customers?.customers;
    data.totalCount = customers?.total_count;
    loading.value = false;
  } catch (error) {
    Notify.create({
      message: "Error: " + error,
      type: "error",
    });
  }
};

const changePage = (page) => {
  data.page = page;

  fetchCustomers();
};

const handleSearch = () => {
  fetchCustomers();
};

const hide = () => {
  emit("hide");
};

const chooseCustomer = (customer) => {
  emit("hide");
  emit("submit", customer);
};

onMounted(() => {
  fetchCustomers();
});
</script>
