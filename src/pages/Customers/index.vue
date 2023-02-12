<template>
  <div class="main-container">
    <p class="header-text">Customers</p>
    <div class="row justify-between">
      <q-input placeholder="Search" outlined dense>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <div>
        <q-btn
          icon="add"
          no-caps
          rounded
          color="primary"
          label="Add"
          class="q-mr-sm"
          @click="router.push('/customers/create')"
        />
        <q-btn icon="delete" no-caps rounded label="Trash" />
      </div>
    </div>
    <div class="main-content">
      <BaseTable
        :rows="data.customers"
        :total-count="data.totalCount"
        :page="data.page"
        :rows-per-page="data.rowsPerPage"
        :columns="headerColumns"
        :loading="loading"
        @changePage="changePage"
      >
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            auto-width
          >
            {{ col.label }}
          </q-th>
        </q-tr>

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
        <template #body-cell-customerCode="props">
          <q-td :props="props">
            {{ props.row.customer_code }}
          </q-td>
        </template>
        <template #body-cell-company="props">
          <q-td :props="props">
            {{ groupedCompanies(props.row.companies) }}
          </q-td>
        </template>
        <template #body-cell-action="props">
          <q-td :props="props">
            <router-link
              :to="`/customers/${props.row.id}`"
              style="text-decoration: none; color: inherit"
            >
              <p class="edit-button">Edit</p></router-link
            >
          </q-td>
        </template>
      </BaseTable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getCustomers } from "../../api/customers";
import { useRouter } from "vue-router";
import BaseTable from "src/components/BaseTable.vue";

const router = useRouter();

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
    name: "label",
    align: "center",
    label: "Label",
    field: "label",
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
  } = await getCustomers({
    limit: data.rowsPerPage,
    page: data.page,
  });

  data.customers = customers;
  data.totalCount = meta?.total_count;
  loading.value = false;
};

onMounted(() => {
  fetchCustomers();
});

const changePage = (page) => {
  data.page = page;

  fetchCustomers();
};
</script>

<style scoped src="./style.scss" />
