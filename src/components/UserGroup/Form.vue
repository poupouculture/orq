<template>
  <!-- Form -->
  <q-form ref="formCreate">
    <div class="q-pa-lg q-mt-lg bg-white rounded-lg">
      <div class="lg:w-10/12 mx-auto">
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <p class="label-style">Name <span class="text-red-600">*</span></p>
            <q-input
              v-model="form.name"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              dense
            />
          </div>
          <div class="col">
            <p class="label-style">Status</p>
            <q-select
              v-model="form.status"
              :options="statusOptions"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              dense
            />
          </div>
        </div>
        <!-- Customer -->
        <h6 class="border-b border-[#D9D9D9]">Customers</h6>
        <div class="flex justify-end items mt-2.5 space-x-3">
          <p class="text-[#9A9AAF]">{{ selectedCustomer.length }} Items</p>
          <div
            @click="toggleCustomerOverlay()"
            class="bg-primary rounded-md flex p-0.5 shadow drop-shadow-lg shadow-blue-700/40 cursor-pointer"
          >
            <q-icon name="add" class="text-white" size="1.2rem" />
          </div>
        </div>
        <!-- User Groups -->
        <h6 class="border-b border-[#D9D9D9]">User Group</h6>
        <div class="flex justify-end items mt-2.5 space-x-3">
          <p class="text-[#9A9AAF]">{{ selectedUserGroup.length }} Items</p>
          <div
            @click="toggleUserGroupOverlay()"
            class="bg-primary rounded-md flex p-0.5 shadow drop-shadow-lg shadow-blue-700/40 cursor-pointer"
          >
            <q-icon name="add" class="text-white" size="1.2rem" />
          </div>
        </div>
        <!-- Button Action -->
        <div class="row q-mb-lg q-gutter-xl q-mt-lg">
          <div class="col flex">
            <div class="btn-dotted" @click="returnDialog = true">
              <p>Return</p>
            </div>
          </div>
          <div class="col flex justify-end">
            <q-btn
              :loading="form.loading"
              color="primary"
              label="Save"
              class="dark-btn"
              @click="submit()"
            />
          </div>
        </div>
      </div>
    </div>
  </q-form>
  <!-- Overlay Add Customer -->
  <AddCustomerOverlay
    @submit="(val) => submitAddCustomer(val)"
    :data="customersData"
    @close="openAddCustomer = false"
    @changePage="(val) => changePage(val, 'customer')"
    :pagination="pagination"
    v-if="openAddCustomer"
  />
  <AddUserGroupOverlay
    @submit="(val) => submitAddUserGroup(val)"
    @close="openAddUserGroup = false"
    :data="userGroupData"
    @changePage="(val) => changePage(val, 'usergroup')"
    :pagination="pagination"
    v-if="openAddUserGroup"
  />
  <ReturnDialog
    v-model="returnDialog"
    @cancel="returnDialog = false"
    @keepEditing="returnDialog = false"
    @submit="dialogSubmit()"
  />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { required } from "src/utils/validation-rules.ts";
import ReturnDialog from "src/components/Dialogs/ReturnDialog.vue";
import AddUserGroupOverlay from "src/components/UserGroup/AddUserGroupOverlay.vue";
import AddCustomerOverlay from "src/components/UserGroup/AddCustomerOverlay.vue";
import {
  addCustomerGroup,
  updateCustomerGroup,
  getAllCustomerEdit,
} from "src/api/customerGroup";
import { Notify } from "quasar";
import { getUserGroups, getAllUserGroupEdit } from "src/api/userGroup";
import { getCustomers } from "src/api/customers";
import useCustomerGroupStore from "src/stores/modules/customerGroup";

const props = defineProps({
  id: [String],
});
const customerGroupStore = useCustomerGroupStore();
const data = computed(() => customerGroupStore.item);
const router = useRouter();
const returnDialog = ref(false);
const selectedCustomer = ref([]);
const selectedUserGroup = ref([]);
const openAddCustomer = ref(false);
const openAddUserGroup = ref(false);
const customersData = ref([]);
const userGroupData = ref([]);
const statusOptions = ["published", "draft"];
const form = reactive({
  name: "",
  status: "",
  loading: false,
});
onMounted(() => {
  if (data.value && props.id) {
    form.name = data.value.name;
    form.status = data.value.status;
    selectedCustomer.value = data.value?.customers.map((c) => c.customers_id);
    selectedUserGroup.value = data.value?.user_groups.map(
      (ug) => ug.user_groups_id
    );
  }
});
const toggleCustomerOverlay = async () => {
  if (!openAddCustomer.value) {
    await fetchCustomers();
  }
  openAddCustomer.value = !openAddCustomer.value;
};
const toggleUserGroupOverlay = async () => {
  if (!openAddCustomer.value) {
    await fetchUserGroups();
  }
  openAddUserGroup.value = !openAddUserGroup.value;
};
const changePage = (val, type) => {
  pagination.page = val;
  if (type === "customer") fetchCustomers();
  else fetchUserGroups();
};
const formCreate = ref();
// Submitted Form
const submit = async () => {
  const validate = await formCreate.value.validate();
  if (!validate) return;
  form.loading = true;
  try {
    let msg;
    if (props.id) {
      const filterCustomer = selectedCustomer.value.filter(
        (customer) =>
          !data.value.customers.map((c) => c.customers_id).includes(customer)
      );
      const filterUserGroup = selectedUserGroup.value.filter(
        (userGroup) =>
          !data.value.user_groups
            .map((us) => us.user_groups_id)
            .includes(userGroup)
      );
      await updateCustomerGroup(props.id, {
        ...form,
        user_groups: {
          create: filterUserGroup.map((usergroup) => ({
            customer_groups_id: props.id,
            user_groups_id: {
              id: usergroup,
            },
          })),
        },
        customers: {
          create: filterCustomer.map((customer) => ({
            customer_groups_id: props.id,
            customers_id: {
              id: customer,
            },
          })),
        },
      });
      msg = "Customer Group successfully updated!";
    } else {
      await addCustomerGroup({
        ...form,
        user_groups: {
          create: userGroupCreate(),
        },
        customers: customerCreate(),
      });
      msg = "Customer Group successfully created!";
    }
    Notify.create(msg);
    router.replace({ name: "customergroups" });
  } catch (error) {}
  form.loading = false;
};
const submitAddCustomer = async (val) => {
  toggleCustomerOverlay();
  if (val.length) val.forEach((val) => selectedCustomer.value.push(val));
};
const submitAddUserGroup = async (val) => {
  toggleUserGroupOverlay();
  if (val.length) val.forEach((val) => selectedUserGroup.value.push(val));
};
const fetchUserGroups = async () => {
  if (props.id) {
    const {
      data: { data: userGroups, meta },
    } = await getAllUserGroupEdit({
      limit: pagination.rowsPerPage,
      page: pagination.page,
      userGroups: selectedUserGroup.value,
    });
    userGroupData.value = userGroups;
    pagination.totalCount = meta?.total_count;
  } else {
    const {
      data: { data: userGroups, meta },
    } = await getUserGroups({
      limit: pagination.rowsPerPage,
      page: pagination.page,
    });
    userGroupData.value = userGroups;
    pagination.totalCount = meta?.total_count;
  }
};
const fetchCustomers = async () => {
  if (props.id) {
    const {
      data: { data: customers, meta },
    } = await getAllCustomerEdit({
      limit: pagination.rowsPerPage,
      page: pagination.page,
      customers: selectedCustomer.value,
    });
    customersData.value = customers;
    pagination.totalCount = meta?.total_count;
  } else {
    const {
      data: { data: customers, meta },
    } = await getCustomers({
      limit: pagination.rowsPerPage,
      page: pagination.page,
    });
    customersData.value = customers;
    pagination.totalCount = meta?.total_count;
  }
};

const customerCreate = () => {
  return selectedCustomer.value.map((customer) => {
    return {
      customer_groups_id: "+",
      customers_id: customer,
    };
  });
};
const userGroupCreate = () => {
  return selectedUserGroup.value.map((userGroup) => {
    return {
      customer_groups_id: "+",
      user_groups_id: userGroup,
    };
  });
};
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  totalCount: 0,
});
const dialogSubmit = async () => {
  router.push({ name: "customergroups" });
};
</script>
