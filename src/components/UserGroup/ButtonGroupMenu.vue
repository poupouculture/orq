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
    <AddCustomerOverlay
      v-if="openAddCustomer"
      @submit="(val) => submitAddCustomer(val)"
      @close="openAddCustomer = false"
      :data="customersData"
      @changePage="changePage"
      :pagination="pagination"
    />
  </div>
</template>
<script setup>
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import { ref, reactive } from "vue";
import useCustomerGroupStore from "src/stores/modules/customerGroup";
import AddCustomerOverlay from "./AddCustomerOverlay.vue";
import { getCustomersFilter } from "src/api/customerGroup";
import { Loading } from "quasar";

const props = defineProps({
  id: [String, Number],
});
const customerGroupStore = useCustomerGroupStore();
const customersData = ref([]);
const deleteDialog = ref(false);
const openAddCustomer = ref(false);

const toggleAddCustomer = async () => {
  if (!openAddCustomer.value) {
    await fetchCustomers();
  }
  openAddCustomer.value = !openAddCustomer.value;
};
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  totalCount: 0,
});
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
    },
    props.id
  );
  Loading.hide();
  customersData.value = customers;
  pagination.totalCount = meta?.total_count;
};

const submitAddCustomer = async (val) => {
  toggleAddCustomer();
  if (val && val.length) {
    customerGroupStore.addCustomer({
      id: props.id,
      customers: val,
    });
  }
};

const submitDelete = async () => {
  await customerGroupStore.delete(props.id);
};
</script>
