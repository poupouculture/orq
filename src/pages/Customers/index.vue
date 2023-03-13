<template>
  <div class="main-container">
    <p class="header-text">Customers</p>
    <div class="row justify-between">
      <q-input
        placeholder="Search"
        outlined
        dense
        v-model="search.query"
        :debounce="500"
        @update:model-value="searchHandler()"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-circular-progress
            v-if="search.loading"
            indeterminate
            rounded
            size="18px"
            color="gray-1"
          />
          <q-icon
            v-else-if="search.query"
            name="close"
            class="text-gray-400 cursor-pointer"
            @click="resetSearch()"
          />
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
        <q-btn
          icon="delete"
          no-caps
          rounded
          label="Trash"
          :disabled="!selected.length"
          @click="deleteCustomerDialog = true"
        />
      </div>
    </div>
    <div class="main-content">
      <BaseTable
        :rows="data.customers"
        :total-count="search.query ? data.filterCount : data.totalCount"
        v-model:page="data.page"
        :rows-per-page="data.rowsPerPage"
        :columns="headerColumns"
        :loading="loading"
        row-key="id"
        @changePage="changePage"
        v-model:selected="selected"
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
        <template #body-cell-label="props">
          <q-td :props="props">
            <div v-if="props.row.tags.length">
              <div v-for="(tag, index) in props.row.tags" :key="index">
                <q-chip color="primary" text-color="white"
                  >{{ tag.tags_id.name }}
                </q-chip>
              </div>
            </div>
          </q-td>
        </template>
        <template #body-cell-action="props">
          <q-td :props="props">
            <q-btn
              size="sm"
              :to="`/customers/${props.row.id}`"
              flat
              round
              color="primary"
              icon="edit"
            >
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
              >
                Edit
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </BaseTable>
    </div>
    <DeleteDialog
      v-model="deleteCustomerDialog"
      @cancel="deleteCustomerDialog = false"
      @submitDelete="handleDelete()"
    />
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { getCustomers } from "src/api/customers";
import { useRouter } from "vue-router";
import BaseTable from "src/components/BaseTable.vue";
import useCustomerStore from "src/stores/modules/customer";
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";

const router = useRouter();
const customerStore = useCustomerStore();

const headerColumns = [
  {
    name: "first_name",
    align: "left",
    label: "Name",
    field: "first_name",
    classes: "text-black",
    style: "max-width: 10%",
    sortable: true,
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
    name: "customer_code",
    align: "left",
    label: "Customer Code",
    field: "customer_code",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "label",
    align: "center",
    label: "Label",
    field: "label",
    classes: "text-black",
    style: "max-width: 20%",
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

const search = reactive({
  loading: false,
  query: "",
});
const searchHandler = async () => {
  search.loading = true;
  try {
    await fetchCustomers();
    search.loading = false;
  } catch (error) {
    search.loading = false;
  }
};
const resetSearch = () => {
  search.query = "";
  searchHandler();
};

const deleteCustomerDialog = ref(false);
const handleDelete = async () => {
  deleteCustomerDialog.value = false;
  await customerStore.deleteCustomer(selected.value.map((item) => item.id));
  selected.value = [];
  await fetchCustomers();
};
const data = reactive({
  customers: [],
  totalCount: 0,
  filterCount: 0,
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
    search: search.query.length ? search.query : undefined,
    filter: search.query.length
      ? {
          key: "filter[first_name][_neq]",
          value: "null",
        }
      : undefined,
  });
  data.customers = customers;
  data.totalCount = meta?.total_count;
  data.filterCount = meta?.filter_count;
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
