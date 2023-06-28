<template>
  <div class="main-container">
    <p class="header-text">Customers</p>
    <div class="row justify-between gap-y-3">
      <SearchTableInput
        :loading="search.loading"
        @search="searchHandler"
        @reset="resetSearch"
      />
      <div>
        <!-- <q-btn
          icon="add"
          no-caps
          rounded
          color="primary"
          label="Add"
          class="q-mr-sm"
          to="/customers/create"
        /> -->
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
              <div class="subrow">
                <p class="headingtext">
                  {{ props.row.customer_company_name_en }}
                </p>
                <p class="subheadingtext">
                  {{ format(new Date(props.row.date_created), "yyyy-M-d") }}
                </p>
              </div>
            </div>
            <p></p>
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
        <template #body-cell-company="props">
          <q-td :props="props">
            {{ groupedCompanies(props.row.companies) }}
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
              v-if="canEdit"
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
import useUserInfoStore from "src/stores/modules/userInfo";
import BaseTable from "src/components/BaseTable.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";
import useCustomerStore from "src/stores/modules/customer";
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import { format } from "date-fns";

const customerStore = useCustomerStore();
const userInfoStore = useUserInfoStore();
const headerColumns = [
  {
    name: "name",
    align: "left",
    label: "Name",
    field: "name",
    classes: "text-black",
    style: "max-width: 10%",
    sortable: true,
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
    name: "location_code",
    align: "left",
    label: "Location Code",
    field: "location_code",
    classes: "text-black",
    style: "max-width: 10%",
    sortable: true,
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
    name: "company",
    align: "left",
    label: "Company",
    field: "company",
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

const canEdit = ref(false);

const loading = ref(true);
const selected = ref([]);

const search = reactive({
  loading: false,
  query: "",
});
const searchHandler = async (searchValue = "") => {
  search.query = searchValue;
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
  return companies
    ? companies.map((company) => company.companies_id.name_english).join(", ")
    : "";
};

const fetchCustomers = async () => {
  const params = {
    limit: data.rowsPerPage,
    page: data.page,
    search: search.query.length ? search.query : undefined,
  };
  if (search.query) {
    params.filter = {
      key: "filter[_or][0][customer_company_name_en][_contains]",
      value: search.query,
    };
  }
  const {
    data: { data: customers, meta },
  } = await getCustomers(params);
  data.customers = customers;
  data.totalCount = meta?.total_count;
  data.filterCount = meta?.filter_count;
  loading.value = false;
};

onMounted(() => {
  // console.log(userInfoStore.getPageActionsByPageId("F03", "Edit"));
  canEdit.value = userInfoStore.getPageActionsByPageId("F03", "Edit");
  fetchCustomers();
});

const changePage = (page) => {
  data.page = page;
  fetchCustomers();
};
</script>

<style scoped src="./style.scss" />
