<template>
  <div class="main-container">
    <p class="header-text">Contact - Customer</p>
    <div class="row justify-between gap-y-3">
      <SearchTableInput
        :loading="search.loading"
        @search="searchHandler"
        :searchOnEnter="true"
        @reset="resetSearch"
      >
        <template #filter_sort>
          <q-icon name="filter_list" class="cursor-pointer">
            <q-menu
              fit
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 10]"
            >
              <div class="py-3 px-2">
                <ul class="max-w-sm space-y-3 w-80">
                  <li
                    class="py-1 px-3 bg-gray-100 rounded-lg flex items-center justify-between cursor-pointer flex-nowrap"
                    v-for="(filter, index) in filterData"
                    :key="filter.key"
                  >
                    <div
                      class="flex items-center space-x-2 w-full flex-nowrap overflow-x-auto"
                    >
                      <span class="whitespace-nowrap">
                        {{ filter.label }}
                      </span>
                      <q-icon name="arrow_forward" />
                      <span class="font-bold whitespace-nowrap">
                        {{ printFilterBy(filter.filterBy) }}
                        <q-menu
                          fit
                          anchor="bottom middle"
                          self="top middle"
                          :offset="[0, 10]"
                          class="border"
                          dense
                          v-model="openFilterBy[index]"
                        >
                          <q-list style="min-width: 100px">
                            <q-item
                              clickable
                              v-for="filterBy in filterByMenus"
                              :key="filterBy.key"
                              @click="changeFilterBy(filterBy, index)"
                            >
                              <q-item-section>
                                {{ filterBy.label }}
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </span>
                      <input
                        type="text"
                        placeholder="- -"
                        @keyup.enter="loadFilter()"
                        v-model="filter.model"
                        class="bg-transparent border-none focus:outline-none w-full"
                      />
                    </div>
                    <q-icon
                      class="w-4"
                      name="close"
                      @click="removeFilterData(filter)"
                    />
                  </li>
                  <li
                    class="py-1 px-3 bg-gray-100 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span><q-icon name="add" /> Add Filter</span>
                    <span>
                      <q-icon
                        class="transform transition-all"
                        :class="[{ 'rotate-180': addFilter }]"
                        name="expand_more"
                      />
                    </span>
                    <q-menu
                      fit
                      anchor="bottom middle"
                      self="top middle"
                      :offset="[0, 10]"
                      class="border py-1"
                      v-model="addFilter"
                    >
                      <q-list dense>
                        <q-item
                          clickable
                          v-for="filter in filterMenus"
                          :key="filter.key"
                          :disabled="isDupliclateFilterMenu(filter)"
                          :class="{
                            'opacity-60': isDupliclateFilterMenu(filter),
                          }"
                          @click="pushFilterData(filter)"
                        >
                          <q-item-section>{{ filter.label }}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </li>
                </ul>
              </div>
            </q-menu>
          </q-icon>
        </template>
      </SearchTableInput>
      <div>
        <!-- ??? 0614 comment out -->
        <!-- <q-btn
          no-caps
          rounded
          color="primary"
          label="Create"
          class="q-mr-sm"
          @click="addDialog = true"
        /> -->
        <q-btn
          no-caps
          rounded
          color="primary"
          label="Disassociate"
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
    <q-dialog v-model="addDialog">
      <FormContact @close="addDialog = false" @save="saveContact($event)" />
    </q-dialog>
    <q-dialog v-model="editContactDialog">
      <FormContact
        @close="editContactDialog = false"
        :form="form"
        @save="updateContact($event)"
      />
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
import FormContact from "src/components/Contact/FormContact.vue";

const contactStore = useContactStore();
const loading = ref(true);
const editContactDialog = ref(false);
const selected = ref([]);
const isExistCustomerRelation = computed(() =>
  selected.value.some((data: any) => !data.customers.length)
);

const filterMenus = [
  {
    key: "customer_code",
    label: "Customer Code",
    queryFilter: "[customers][customers_id][customer_code]",
    model: null,
  },
  {
    key: "location_code",
    label: "Location Code",
    queryFilter: "[customers][customers_id][location_code]",
    model: null,
  },
  {
    key: "number",
    label: "Number",
    queryFilter: "[number]",
    model: null,
  },
];
const filterByMenus = [
  {
    key: "_contains",
    label: "Contains",
  },
  {
    key: "_eq",
    label: "Equals to",
  },
];
const filterData = ref([]) as any;
const addFilter = ref(false);
const openFilterBy = ref([]) as any;
const selectedFilterMenu = ref("");

const loadFilter = () => {
  const results = [] as any;
  filterData.value.forEach((data: any, index: number) => {
    if (data.model) {
      results.push({
        key: `filter[_and][0][_and][${index}]${data.queryFilter}[${data.filterBy}]`,
        value: data.model,
      });
    }
  });
  fetchContacts(results);
};

const pushFilterData = (data: any) => {
  addFilter.value = false;
  if (isDupliclateFilterMenu(data)) return;
  filterData.value.push({
    ...data,
    filterBy: "_contains",
  });
};
const changeFilterBy = (data: any, index: number) => {
  openFilterBy.value[index] = false;
  filterData.value[index] = {
    ...filterData.value[index],
    filterBy: data.key,
  };
};
const removeFilterData = (data: any) => {
  filterData.value = filterData.value.filter((d: any) => d.key !== data.key);
  loadFilter();
};
const printFilterBy = (key: string) => {
  return filterByMenus.find((d: any) => d.key === key)?.label;
};
const isDupliclateFilterMenu = (data: any) => {
  return filterData.value.find((d: any) => d.key === data.key);
};
const saveContact = async (data: any) => {
  try {
    await contactStore.saveContact({
      ...data,
      id: form.id,
    });
    fetchContacts();
  } catch (error) {
    console.log(error);
  }
  addDialog.value = false;
};
const updateContact = async (data: any) => {
  try {
    await contactStore.updateContact({
      ...data,
      id: form.id,
    });
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
    form.preferred_language = contact.preferred_language;
    form.category = contact.category;
    form.status = contact.status;
  }
};

const form = reactive({
  id: null,
  first_name: null,
  last_name: null,
  number: 0,
  is_active: false,
  category: null,
  status: null,
  preferred_language: "en-US",
});

const search = reactive({
  loading: false,
  query: "",
});

// const changeFilterMenu = (type: string) => {
//   selectedFilterMenu.value = type;
//   if (search.query) searchHandler(search.query);
// };
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
  selectedFilterMenu.value = "";
  searchHandler();
};

const addDialog = ref(false);

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

const fetchContacts = async (filter?: any) => {
  const {
    data: { data: contacts, meta },
  } = await getContacts({
    limit: data.rowsPerPage,
    page: data.page,
    filter,
    filterType: selectedFilterMenu.value,
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
    label: "First Name",
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
