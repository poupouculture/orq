<template>
  <!-- Form -->
  <q-form ref="Form">
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
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <p class="label-style">Type</p>
            <template v-for="(type, i) in typeOptions" :key="i">
              <q-radio
                v-model="form.type"
                :val="type.value"
                :label="type.label"
                color="gray-3"
              />
            </template>
          </div>
        </div>
        <!-- user -->
        <h6 class="border-b border-[#D9D9D9]">Users</h6>
        <div class="flex justify-end items mt-2.5 space-x-3">
          <p class="text-[#9A9AAF]">{{ selectedUser.length }} Items</p>
          <div
            @click="toggleUserOverlay()"
            class="bg-primary rounded-md flex p-0.5 shadow drop-shadow-lg shadow-blue-700/40 cursor-pointer"
          >
            <q-icon name="add" class="text-white" size="1.2rem" />
          </div>
        </div>
        <!-- user Groups -->
        <h6 class="border-b border-[#D9D9D9]">Customer Group</h6>
        <div class="flex justify-end items mt-2.5 space-x-3">
          <p class="text-[#9A9AAF]">{{ selectedCustomerGroup.length }} Items</p>
          <div
            @click="toggleCustomerGroupOverlay()"
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
              :loading="loading"
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
  <AddCustomerGroupOverlay
    @submit="(val) => submitAddCustomerGroup(val)"
    :data="customerGroupData"
    @close="openAddCustomerGroup = false"
    @changePage="(val) => changePage(val, 'customergroup')"
    :pagination="pagination"
    :selected-data="selectedCustomerGroup"
    v-if="openAddCustomerGroup"
  />
  <AddUserOverlay
    @submit="(val) => submitAddUser(val)"
    @close="openAddUser = false"
    :data="userData"
    @changePage="(val) => changePage(val, 'user')"
    :pagination="pagination"
    :selected-data="selectedUser"
    v-if="openAddUser"
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
import AddCustomerGroupOverlay from "src/components/InternalGroup/AddCustomerGroupOverlay.vue";
import AddUserOverlay from "src/components/InternalGroup/AddUserOverlay.vue";
import useInternalGroupStore from "src/stores/modules/internalGroup";
import { getUsersFilter } from "src/api/InternalGroup";
import { getUsers } from "src/api/user";
import {
  getAllCustomerGroupEdit,
  getCustomerGroups,
} from "src/api/customerGroup";
import { Loading } from "quasar";

const statusOptions = ["published", "draft"];
const typeOptions = [
  { value: "manager", label: "Manager" },
  { value: "cs", label: "Customer Service" },
];
const props = defineProps({
  id: [String],
  loading: Boolean,
});
const loading = computed(() => props.loading);
const emits = defineEmits(["submit"]);
const internalGroupStore = useInternalGroupStore();
const data = computed(() => internalGroupStore.item);
const router = useRouter();
const returnDialog = ref(false);
const selectedCustomerGroup = ref([]);
const selectedUser = ref([]);
const openAddUser = ref(false);
const openAddCustomerGroup = ref(false);
const customerGroupData = ref([]);
const userData = ref([]);
const form = reactive({
  name: "",
  status: "",
  type: "manager",
  loading: false,
});
onMounted(() => {
  if (data.value && props.id) {
    form.name = data.value.name;
    form.status = data.value.status;
    form.type = data.value.type;
    selectedCustomerGroup.value = data.value?.customer_groups.map(
      (c) => c.customer_groups_id
    );
    selectedUser.value = data.value?.users.map((ug) => ug.directus_users_id);
  }
});
const toggleUserOverlay = async () => {
  if (!openAddUser.value) {
    await fetchUsers();
  }
  openAddUser.value = !openAddUser.value;
};
const toggleCustomerGroupOverlay = async () => {
  if (!openAddCustomerGroup.value) {
    await fetchCustomerGroups();
  }
  openAddCustomerGroup.value = !openAddCustomerGroup.value;
};
const changePage = (val, type) => {
  pagination.page = val;
  if (type === "user") fetchUsers();
  else fetchCustomerGroups();
};
const Form = ref();
// Submitted Form
const submit = async () => {
  const validate = await Form.value.validate();
  if (!validate) return;
  if (props.id) {
    const filterCustomerGroup = selectedCustomerGroup.value.filter(
      (customerGroup) =>
        !data.value.customer_groups
          .map((c) => c.customer_groups_id)
          .includes(customerGroup)
    );
    const filterUser = selectedUser.value.filter(
      (user) =>
        !data.value.users.map((us) => us.directus_users_id).includes(user)
    );
    emits("submit", {
      form,
      customerGroups: filterCustomerGroup,
      users: filterUser,
    });
  } else {
    emits("submit", {
      form,
      customerGroups: selectedCustomerGroup.value,
      users: selectedUser.value,
    });
  }
};
const submitAddCustomerGroup = async (val) => {
  toggleCustomerGroupOverlay();
  selectedCustomerGroup.value = val;
};
const submitAddUser = async (val) => {
  toggleUserOverlay();
  selectedUser.value = val;
};
const fetchCustomerGroups = async () => {
  if (props.id) {
    Loading.show();
    const {
      data: { data: userGroups, meta },
    } = await getAllCustomerGroupEdit({
      limit: pagination.rowsPerPage,
      page: pagination.page,
      customerGroups: selectedCustomerGroup.value,
    });
    Loading.hide();
    customerGroupData.value = userGroups;
    pagination.totalCount = meta?.total_count;
  } else {
    Loading.show();
    const {
      data: { data: customerGroups, meta },
    } = await getCustomerGroups(
      {
        limit: pagination.rowsPerPage,
        page: pagination.page,
      },
      props.id
    );
    Loading.hide();
    customerGroupData.value = customerGroups;
    pagination.totalCount = meta?.total_count;
  }
};
const fetchUsers = async () => {
  if (props.id) {
    Loading.show();
    const {
      data: { data: customerGroups, meta },
    } = await getUsersFilter(
      {
        limit: pagination.rowsPerPage,
        page: pagination.page,
        customers: selectedCustomerGroup.value,
      },
      props.id
    );
    Loading.hide();
    userData.value = customerGroups;
    pagination.totalCount = meta?.total_count;
  } else {
    Loading.show();
    const {
      data: { data: customers, meta },
    } = await getUsers({
      limit: pagination.rowsPerPage,
      page: pagination.page,
    });
    Loading.hide();
    userData.value = customers;
    pagination.totalCount = meta?.total_count;
  }
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
