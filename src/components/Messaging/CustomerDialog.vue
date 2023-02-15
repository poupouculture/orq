<template>
  <q-dialog :modelValue="modelValue" @hide="hide">
    <q-card
      style="min-width: 85%; min-height: 85%"
      class="q-pa-lg flex flex-col"
    >
      <q-card-section>
        <p class="text-lg mb-2">Customers</p>
        <div class="row justify-between">
          <q-input placeholder="Search" outlined dense>
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
                  <div>
                    <q-avatar size="md">
                      <img src="../../assets/images/profileavatar.png" />
                    </q-avatar>
                  </div>
                  <div class="subrow">
                    <p class="headingtext">
                      {{ props.row.first_name }}
                      {{ props.row.last_name }}
                    </p>
                    <p class="subheadingtext">2022-8-10</p>
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
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getCustomersWithContacts } from "src/api/customers";
import BaseTable from "src/components/BaseTable.vue";

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["hide", "submit"]);

const headerColumns = [
  {
    name: "name",
    align: "left",
    label: "Name",
    field: "name",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "company",
    align: "left",
    label: "Company",
    field: "company",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "customerCode",
    align: "left",
    label: "Customer Code",
    field: "customerCode",
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
];
const loading = ref(true);
const data = reactive({
  customers: [],
  totalCount: 0,
  page: 1,
  rowsPerPage: 10,
});

const groupedCompanies = (companies) => {
  const grouped = companies.map((company) => company.companies_id.name_english);
  return grouped.join(", ");
};

const fetchCustomers = async () => {
  const {
    data: { data: customers, meta },
  } = await getCustomersWithContacts({
    limit: data.rowsPerPage,
    page: data.page,
  });

  data.customers = customers;
  data.totalCount = meta?.total_count;
  loading.value = false;
};

const changePage = (page) => {
  data.page = page;

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
