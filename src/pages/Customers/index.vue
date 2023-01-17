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
      <q-table
        selection="multiple"
        :rows="data.customers"
        :columns="headerColumns"
        v-model:pagination="pagination"
        :loading="loading"
        v-model:selected="selected"
        flat
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
                <q-avatar
                  size="36px"
                  color="red"
                  text-color="white"
                  icon="directions"
                />
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
        <template v-slot:bottom>
          <div class="row justify-between q-pt-lg q-pb-lg" style="width: 100%">
            <div class="col">
              {{ getPaginationLabel() }}
            </div>
            <div class="col absolute-bottom-right q-ma-lg">
              <q-pagination
                v-model="page"
                @update:model-value="changePage"
                :max="totalPage()"
                direction-links
                flat
                color="grey"
                active-color="primary"
              />
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs } from "vue";
import { getCustomers } from "../../api/customers.js";
import { useRouter } from "vue-router";

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
const selected = ref([]);
const data = reactive({
  customers: [],
});
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  totalCount: 0,
});
const { page } = toRefs(pagination);

const groupedCompanies = (companies) => {
  const grouped = companies.map((company) => company.companies_id.name_english);
  return grouped.join(", ");
};

const getPaginationLabel = () => {
  const max = pagination.page * pagination.rowsPerPage;
  const maxIndex = pagination.totalCount < max ? pagination.totalCount : max;
  const minIndex = pagination.rowsPerPage * (pagination.page - 1) + 1;

  return `Showing ${minIndex} to ${maxIndex} of
  ${pagination.totalCount} results`;
};

const totalPage = () => {
  return Math.ceil(pagination.totalCount / pagination.rowsPerPage);
};

const changePage = (val) => {
  pagination.page = val;
  fetchCustomers({
    limit: pagination.rowsPerPage,
    page: pagination.page,
  });
};

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
};

onMounted(() => {
  fetchCustomers();
});
</script>

<style scoped src="./style.scss" />
