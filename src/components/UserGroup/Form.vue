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
        <div class="flex justify-end items mt-2.5 space-x-3 mb-3">
          <p class="text-[#9A9AAF]">{{ selectedCustomer.length }} Items</p>
          <div
            @click="toggleCustomerOverlay()"
            class="bg-primary rounded-md flex p-0.5 shadow drop-shadow-lg shadow-blue-700/40 cursor-pointer"
          >
            <q-icon name="add" class="text-white" size="1.2rem" />
          </div>
        </div>
        <!-- customer list -->
        <div v-if="selectedCustomer.length">
          <TransitionGroup name="fade-scale" tag="ul" appear class="relative">
            <li
              class="border rounded-md py-2 px-4 mb-2"
              v-for="(customer, i) in selectedCustomer"
              :key="customer.id"
            >
              <div class="flex items-center justify-between">
                <span
                  >{{ customer.first_name }} {{ customer.last_name }}
                  {{
                    (customer.companies.length &&
                      `/ ${customer.companies[0].companies_id.name_english}`) ||
                    ""
                  }}
                  /
                  {{ customer.position }}</span
                >
                <svg
                  @click="deleteCustomer(i)"
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-[#9A9AAF] cursor-pointer"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M4 7l16 0"></path>
                  <path d="M10 11l0 6"></path>
                  <path d="M14 11l0 6"></path>
                  <path
                    d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
                  ></path>
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                </svg>
              </div>
            </li>
          </TransitionGroup>
        </div>
        <!-- User Groups -->
        <h6 class="border-b border-[#D9D9D9] pt-2">User Group</h6>
        <div class="flex justify-end items mt-2.5 space-x-3 mb-3">
          <p class="text-[#9A9AAF]">{{ selectedUserGroup.length }} Items</p>
          <div
            @click="toggleUserGroupOverlay()"
            class="bg-primary rounded-md flex p-0.5 shadow drop-shadow-lg shadow-blue-700/40 cursor-pointer"
          >
            <q-icon name="add" class="text-white" size="1.2rem" />
          </div>
        </div>
        <!-- User Group List -->
        <div v-if="selectedUserGroup.length">
          <TransitionGroup name="fade-scale" tag="ul" appear class="relative">
            <div
              class="border rounded-md py-2 px-4 mb-2"
              v-for="(user, i) in selectedUserGroup"
              :key="user.id"
            >
              <div class="flex items-center justify-between">
                <span> {{ user.name }} / {{ user.type }} </span>
                <svg
                  @click="deleteUserGroup(i)"
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-[#9A9AAF] cursor-pointer"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M4 7l16 0"></path>
                  <path d="M10 11l0 6"></path>
                  <path d="M14 11l0 6"></path>
                  <path
                    d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
                  ></path>
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                </svg>
              </div>
            </div>
          </TransitionGroup>
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
  <!-- Add Customer -->
  <AddCustomer
    @submit="(val) => submitAddCustomer(val)"
    :data="customersData"
    @close="
      () => {
        openAddCustomer = false;
        customerQuery = '';
      }
    "
    @changePage="(val) => changePage(val, 'customer')"
    :pagination="pagination"
    @search="searchCustomerHandler"
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
import AddUserGroupOverlay from "src/components/UserGroup/AddUserGroup.vue";
import AddCustomer from "src/components/UserGroup/AddCustomer.vue";
import {
  addCustomerGroup,
  updateCustomerGroup,
  getAllCustomerEdit,
} from "src/api/customerGroup";
import { Loading, Notify } from "quasar";
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
const statusOptions = ["published", "draft"];
// User Group state
const openAddUserGroup = ref(false);
const selectedUserGroup = ref([]);
const addedUserGroup = ref([]);
const deletedUserGroup = ref([]);
const userGroupData = ref([]);
// Customer state
const openAddCustomer = ref(false);
const selectedCustomer = ref([]);
const addedCustomer = ref([]);
const deletedCustomer = ref([]);
const customersData = ref([]);
const customerQuery = ref("");

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
const deleteUserGroup = (index) => {
  const userGroupId = selectedUserGroup.value[index].id;
  deletedUserGroup.value.push(userGroupId);
  selectedUserGroup.value.splice(index, 1);
  addedUserGroup.value = addedUserGroup.value.filter(
    (data) => data.id !== userGroupId
  );
};
const deleteCustomer = (index) => {
  const customerId = selectedCustomer.value[index].id;
  deletedCustomer.value.push(customerId);
  selectedCustomer.value.splice(index, 1);
  addedCustomer.value = addedCustomer.value.filter(
    (data) => data.id !== customerId
  );
};
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
const searchCustomerHandler = async (value) => {
  try {
    customerQuery.value = value;
    await fetchCustomers();
  } catch (error) {}
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
      await updateCustomerGroup(props.id, {
        ...form,
        user_groups: {
          create: addedUserGroup.value.map((userGroup) => ({
            customer_groups_id: props.id,
            user_groups_id: {
              id: userGroup.id,
            },
          })),
          delete:
            (deletedUserGroup.value.length &&
              data.value.user_groups
                .filter((userGroup) =>
                  deletedUserGroup.value.includes(userGroup.user_groups_id.id)
                )
                .map((data) => data.id)) ||
            [],
        },
        customers: {
          create: addedCustomer.value.map((customer) => ({
            customer_groups_id: props.id,
            customers_id: {
              id: customer.id,
            },
          })),
          delete:
            (deletedCustomer.value.length &&
              data.value.customers
                .filter((customer) =>
                  deletedCustomer.value.includes(customer.customers_id.id)
                )
                .map((data) => data.id)) ||
            [],
        },
      });
      msg = "Customer Group successfully updated!";
    } else {
      await addCustomerGroup({
        ...form,
        user_groups: {
          create: userGroupCreate(),
        },
        customers: {
          create: customerCreate(),
        },
      });
      msg = "Customer Group successfully created!";
    }
    Notify.create({
      message: msg,
      type: "positive",
      color: "primary",
      position: "top",
    });
    router.replace({ name: "customergroups" });
  } catch (error) {}
  form.loading = false;
};
const submitAddCustomer = async (val) => {
  if (val.length)
    val.forEach((val) => {
      addedCustomer.value.push(val);
      selectedCustomer.value.push(val);
    });
};
const submitAddUserGroup = async (val) => {
  if (val.length) {
    val.forEach((val) => {
      addedUserGroup.value.push(val);
      selectedUserGroup.value.push(val);
    });
  }
};
const fetchUserGroups = async () => {
  Loading.show();
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
    pagination.totalCount = customerQuery.value.length
      ? meta?.filter_count
      : meta?.total_count;
  }
  Loading.hide();
};
const fetchCustomers = async () => {
  Loading.show();
  if (props.id) {
    const {
      data: { data: customers, meta },
    } = await getAllCustomerEdit({
      limit: pagination.rowsPerPage,
      page: pagination.page,
      customers: selectedCustomer.value,
      search: customerQuery.value?.length ? customerQuery.value : undefined,
      filter: customerQuery.value?.length
        ? {
            key: "filter[first_name][_neq]",
            value: "null",
          }
        : undefined,
    });
    customersData.value = customers;
    pagination.totalCount = meta?.total_count;
  } else {
    const {
      data: { data: customers, meta },
    } = await getCustomers({
      limit: pagination.rowsPerPage,
      page: pagination.page,
      search: customerQuery.value?.length ? customerQuery.value : undefined,
      filter: customerQuery.value?.length
        ? {
            key: "filter[first_name][_neq]",
            value: "null",
          }
        : undefined,
    });
    customersData.value = customers;
    pagination.totalCount = customerQuery.value.length
      ? meta?.filter_count
      : meta?.total_count;
  }
  Loading.hide();
};

const customerCreate = () => {
  return selectedCustomer.value.map((customer) => {
    return {
      customer_groups_id: "+",
      customers_id: customer.id,
    };
  });
};
const userGroupCreate = () => {
  return selectedUserGroup.value.map((userGroup) => {
    return {
      customer_groups_id: "+",
      user_groups_id: userGroup.id,
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
