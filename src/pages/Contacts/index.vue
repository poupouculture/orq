<template>
  <div class="main-container">
    <p class="header-text">Contact - Customer</p>
    <div class="row justify-between gap-y-3">
      <SearchTableInput
        :loading="search.loading"
        @search="searchHandler"
        :searchOnEnter="true"
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
      </div>
    </div>
    <div class="main-content">
      <BaseTable
        :rows="data.contacts"
        :total-count="data.filterCount"
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
                    props.row.customers.length
                      ? props.row.customers[0].customers_id
                          ?.customer_company_name_en || ""
                      : ""
                  }}
                </p>
              </div>
            </div>
            <p></p>
          </q-td>
        </template>
        <template #body-cell-customer_code="props">
          <q-td :props="props" auto-width>
            {{
              props.row.customers.length
                ? props.row.customers[0].customers_id?.customer_code || ""
                : ""
            }}
          </q-td>
        </template>
        <template #body-cell-location_code="props">
          <q-td :props="props" auto-width>
            {{
              props.row.customers.length
                ? props.row.customers[0].customers_id?.location_code || ""
                : ""
            }}
          </q-td>
        </template>
        <template #body-cell-is_active="props">
          <q-td :props="props" auto-width>
            {{ props.row.is_active ? "Yes" : "No" }}
          </q-td>
        </template>
        <template #body-cell-action="props">
          <q-td :props="props" auto-width>
            <q-btn
              no-caps
              rounded
              color="primary"
              label="Edit"
              @click="openEditContact(props.row.id)"
            />
          </q-td>
        </template>
      </BaseTable>
    </div>
    <BaseDialog
      v-model="deleteDialog"
      @cancel="deleteDialog = false"
      title="Disassociate"
      description="This action is permanent and can not be undone. Are you sure you would like to proceed?"
      submit-label="Confirm"
      @submit="handleDelete"
    />
    <q-dialog v-model="editContactDialog">
      <div class="flex flex-col bg-white p-6">
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div class="flex flex-col">
            <p class="label-style">First Name</p>
            <q-input outlined v-model="form.first_name" dense />
          </div>
          <div class="flex flex-col">
            <p class="label-style">Last Name</p>
            <q-input outlined v-model="form.last_name" dense />
          </div>
          <div class="flex flex-col">
            <p class="label-style">Number</p>
            <q-input outlined v-model="form.number" dense />
            <q-checkbox
              :true-value="true"
              v-model="form.is_active"
              :false-value="false"
              label="Contact is Active"
            />
          </div>
          <div class="flex flex-col">
            <p class="label-style">Category</p>
            <q-select
              outlined
              dense
              v-model="form.category"
              lazy-rules
              :options="categoryOptions"
            />
          </div>
        </div>
        <div class="flex items-center gap-x-3 mt-5 justify-end">
          <q-btn
            @click="editContactDialog = false"
            color="secondary"
            outline
            label="Cancel"
          />
          <q-btn @click="updateContact()" color="primary" label="Save" />
        </div>
      </div>
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { getContacts, dissociateContacts } from "src/api/contact";
import BaseTable from "src/components/BaseTable.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";
import { Notify } from "quasar";
import useContactStore from "src/stores/modules/contact";
import BaseDialog from "src/components/Dialogs/BaseDialog.vue";

const contactStore = useContactStore();
const loading = ref(true);
const editContactDialog = ref(false);
const selected = ref([]);
const isExistCustomerRelation = computed(() =>
  selected.value.some((data: any) => !data.customers.length)
);

const updateContact = async () => {
  try {
    await contactStore.updateContact(form);
    fetchContacts();
  } catch (error) {
    console.log(error);
  }
  editContactDialog.value = false;
};
const openEditContact = async (id: string) => {
  const contact = data.contacts.find((data: any) => data.id === id) as any;
  editContactDialog.value = true;
  if (contact) {
    form.id = contact.id;
    form.first_name = contact.first_name;
    form.last_name = contact.last_name;
    form.number = contact.number;
    form.is_active = contact.is_active;
    form.category = contact.category;
    form.status = contact.status;
  }
};

const categoryOptions = ref(["phone"]);
const form = reactive({
  id: null,
  first_name: null,
  last_name: null,
  number: 0,
  is_active: false,
  category: null,
  status: null,
});

const search = reactive({
  loading: false,
  query: "",
});

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
      .filter((data: any) => data.customers.length)
      .map((data: any) => ({
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

const changePage = (page: number) => {
  data.page = page;
  fetchContacts();
};

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
    name: "first_name",
    align: "left",
    label: "Firstname",
    field: "first_name",
    classes: "text-black",
    style: "max-width: 10%",
    sortable: true,
  },
  // {
  //   name: "last_name",
  //   align: "left",
  //   label: "Lastname",
  //   field: "last_name",
  //   classes: "text-black",
  //   style: "max-width: 10%",
  //   sortable: true,
  // },
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
    name: "is_active",
    align: "left",
    label: "Active",
    field: "is_active",
    classes: "text-black",
    style: "max-width: 10%",
    sortable: true,
  },
  {
    name: "action",
    align: "left",
    label: "Action",
    field: "action",
    classes: "text-black",
    style: "max-width: 10%",
    sortable: true,
  },
];
</script>

<style scoped src="./style.scss" />
