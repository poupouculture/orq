<template>
  <div class="flex items-center">
    <q-btn color="grey-7" round flat icon="more_vert">
      <q-menu fit anchor="bottom middle" self="top right" auto-close>
        <q-list>
          <q-item
            clickable
            :to="{ name: 'customergroups.edit', params: { id } }"
          >
            <q-item-section>Edit</q-item-section>
          </q-item>
          <q-item clickable @click="toggleAddCustomer()">
            <q-item-section>Add Customers</q-item-section>
          </q-item>
          <q-item clickable @click="deleteDialog = true">
            <q-item-section>Delete Group</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <DeleteDialog
      v-model="deleteDialog"
      @cancel="deleteDialog = false"
      @submit-delete="submitDelete"
    />

    <AddCustomer
      @submit="(val) => submitAddCustomer(val)"
      @close="openAddCustomer = false"
      :data="customersData"
      @changePage="changePage"
      :pagination="pagination"
      @search="searchHandler($event)"
      v-if="openAddCustomer"
    />
  </div>
</template>
<script setup>
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import { ref, computed, reactive } from "vue";
import useCustomerGroupStore from "src/stores/modules/customerGroup";
import AddCustomer from "./AddCustomer.vue";
import { getCustomersFilter } from "src/api/customerGroup";
import { Loading } from "quasar";

const emits = defineEmits(["addCustomer"]);
const props = defineProps({
  id: [String, Number],
});
const customerGroupStore = useCustomerGroupStore();
const customersData = ref([]);
const deleteDialog = ref(false);
const query = ref("");
const openAddCustomer = ref(false);
const item = computed(() =>
  customerGroupStore.items.find((item) => item.id === props.id)
);
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  totalCount: 0,
});

const toggleAddCustomer = async () => {
  if (!openAddCustomer.value) {
    await fetchCustomers();
  }
  openAddCustomer.value = !openAddCustomer.value;
};
const searchHandler = async (value) => {
  try {
    query.value = value;
    await fetchCustomers();
  } catch (error) {}
};

const changePage = (val) => {
  pagination.page = val;
  fetchCustomers();
};

const fetchCustomers = async () => {
  Loading.show();
  const {
    data: { data: customers, meta },
  } = await getCustomersFilter(
    {
      limit: pagination.rowsPerPage,
      page: pagination.page,
      search: query.value?.length ? query.value : undefined,
      filter: query.value?.length
        ? {
            key: "filter[first_name][_neq]",
            value: "null",
          }
        : undefined,
    },
    item.value.customers.map((customer) => customer.customers_id.id)
  );
  pagination.totalCount = query.value.length
    ? meta?.filter_count
    : meta?.total_count;
  Loading.hide();
  customersData.value = customers;
};

const submitAddCustomer = async (val) => {
  if (val && val.length) {
    await customerGroupStore.addCustomer({
      id: props.id,
      customers: val.map((item) => item.id),
    });
    openAddCustomer.value = false;
    emits("addCustomer");
  }
};

const submitDelete = async () => {
  await customerGroupStore.delete(props.id);
};
</script>
