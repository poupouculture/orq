<template>
  <div class="main-container">
    <p class="header-text">Contacts</p>
    <div class="row justify-between gap-y-3">
      <SearchTableInput
        :loading="search.loading"
        @search="searchHandler"
        @reset="resetSearch"
      />
      <div>
        <q-btn
          no-caps
          rounded
          color="primary"
          label="Disassociate"
          class="q-mr-sm"
          :disabled="selected.length < 1 || isExistCustomerRelation"
          @click="deleteDialog = true"
        />
        <q-btn
          icon="add"
          no-caps
          rounded
          color="primary"
          label="Add"
          class="q-mr-sm"
          @click="addContactDialog = true"
        />
      </div>
    </div>
    <div class="main-content">
      <BaseTable
        :rows="data.contacts"
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
                  {{
                    props.row.customers[0]?.customers_id
                      .customer_company_name_en
                  }}
                </p>
              </div>
            </div>
            <p></p>
          </q-td>
        </template>
        <template #body-cell-customer_code="props">
          <q-td :props="props" auto-width>
            {{ props.row.customers[0]?.customers_id.customer_code }}
          </q-td>
        </template>
        <template #body-cell-location_code="props">
          <q-td :props="props" auto-width>
            {{ props.row.customers[0]?.customers_id.location_code }}
          </q-td>
        </template>
      </BaseTable>
    </div>
    <DeleteDialog
      v-model="deleteDialog"
      @cancel="deleteDialog = false"
      @submitDelete="handleDelete()"
    />
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { getContacts, dissociateContacts } from "src/api/contact";
import BaseTable from "src/components/BaseTable.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import { Notify } from "quasar";

const headerColumns = [
  {
    name: "number",
    align: "left",
    label: "Number",
    field: "number",
    classes: "text-black",
    style: "max-width: 10%",
    sortable: true,
  },

  {
    name: "name",
    align: "left",
    label: "Customer Name",
    field: "first_name",
    classes: "text-black",
    style: "max-width: 10%",
    sortable: true,
  },
  {
    name: "customer_code",
    align: "left",
    label: "Customer Code",
    field: "customer_code",
    classes: "text-black",
    style: "max-width: 10%",
    sortable: true,
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
    name: "status",
    align: "left",
    label: "Status",
    field: "status",
    classes: "text-black",
    style: "max-width: 10%",
    sortable: true,
  },
];

const loading = ref(true);
const addContactDialog = ref(false);
const selected = ref([]);

const search = reactive({
  loading: false,
  query: "",
});
const isExistCustomerRelation = computed(() =>
  selected.value.some((data) => !data.customers.length)
);

const searchHandler = async (searchValue = "") => {
  search.query = searchValue;
  search.loading = true;
  try {
    await fetchContacts();
    search.loading = false;
  } catch (error) {
    search.loading = false;
  }
};
const resetSearch = () => {
  search.query = "";
  searchHandler();
};

const deleteDialog = ref(false);
const handleDelete = async () => {
  deleteDialog.value = false;
  try {
    const payload = selected.value
      .filter((data) => data.customers.length)
      .map((data) => ({
        customer_id: data.customers[0].customers_id.id,
        contact_id: data.id,
      }));
    await dissociateContacts(payload);
    Notify.create({
      message: "Successful to disassociate contact",
      position: "top",
      color: "primary",
      type: "positive",
    });
    selected.value = [];
    await fetchContacts();
  } catch (error) {
    console.log(error);
  }
};
const data = reactive({
  contacts: [],
  totalCount: 0,
  filterCount: 0,
  page: 1,
  rowsPerPage: 10,
});

const fetchContacts = async () => {
  const {
    data: { data: contacts, meta },
  } = await getContacts({
    limit: data.rowsPerPage,
    page: data.page,
    search: search.query.length ? search.query : undefined,
  });
  data.contacts = contacts;
  data.totalCount = meta?.total_count;
  data.filterCount = meta?.filter_count;
  loading.value = false;
};

onMounted(() => {
  fetchContacts();
});

const changePage = (page) => {
  data.page = page;
  fetchContacts();
};
</script>

<style scoped src="./style.scss" />
