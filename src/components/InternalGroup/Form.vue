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
        <!-- Tags -->
        <div class="row q-mb-lg q-gutter-xl">
          <div class="col">
            <BaseMultiOptions
              v-model="tags"
              label="Tags"
              filter-url="/items/tags"
              :options="options.tags"
              option-variable-name="tags"
              @update:multi-options="updateMultiOptions"
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
        <div class="flex justify-end items mt-2.5 space-x-3 mb-3">
          <p class="text-[#9A9AAF]">{{ selectedUser.length }} Items</p>
          <div
            @click="toggleUserOverlay()"
            class="bg-primary rounded-md flex p-0.5 shadow drop-shadow-lg shadow-blue-700/40 cursor-pointer"
          >
            <q-icon name="add" class="text-white" size="1.2rem" />
          </div>
        </div>
        <!-- customer list -->
        <div v-if="selectedUser.length">
          <TransitionGroup name="fade-scale" tag="ul" appear class="relative">
            <li
              class="border rounded-md py-2 px-4 mb-2"
              v-for="(user, i) in selectedUser"
              :key="user.id"
            >
              <div class="flex items-center justify-between">
                <span
                  >{{ user.first_name }} {{ user.last_name }}: {{ user.email }}
                </span>
                <svg
                  @click="deleteUser(i)"
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
        <!-- Customer Groups -->
        <h6 class="border-b border-[#D9D9D9]">Customer Group</h6>
        <div class="flex justify-end items mt-2.5 space-x-3 mb-3">
          <p class="text-[#9A9AAF]">{{ selectedCustomerGroup.length }} Items</p>
          <div
            @click="toggleCustomerGroupOverlay()"
            class="bg-primary rounded-md flex p-0.5 shadow drop-shadow-lg shadow-blue-700/40 cursor-pointer"
          >
            <q-icon name="add" class="text-white" size="1.2rem" />
          </div>
        </div>
        <!-- Customer Group List -->
        <div v-if="selectedCustomerGroup.length">
          <TransitionGroup name="fade-scale" tag="ul" appear class="relative">
            <div
              class="border rounded-md py-2 px-4 mb-2"
              v-for="(customerGroup, i) in selectedCustomerGroup"
              :key="customerGroup.id"
            >
              <div class="flex items-center justify-between">
                <div class="flex gap-x-3">
                  <span>{{ customerGroup.name }} </span>
                  <span class="flex gap-x-3">
                    <span>/</span>
                    {{ customerGroup.type }}
                  </span>
                  <span class="flex gap-x-3">
                    <span>/</span>
                    {{ customerGroup.source }}
                  </span>
                </div>
                <svg
                  @click="deleteCustomerGroup(i)"
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
    :pagination="paginationCustomerGroup"
    @search="searchCustomerGroupHandler"
    v-if="openAddCustomerGroup"
    @update:source="changeSource"
    @update:type="changeCgType"
  />
  <AddUserOverlay
    @submit="(val) => submitAddUser(val)"
    @close="openAddUser = false"
    :data="userData"
    @changePage="(val) => changePage(val, 'user')"
    :pagination="paginationUser"
    @search="searchUserHandler"
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
import AddCustomerGroupOverlay from "src/components/InternalGroup/AddCustomerGroup.vue";
import AddUserOverlay from "src/components/InternalGroup/AddUser.vue";
import useInternalGroupStore from "src/stores/modules/internalGroup";
import { getUsersFilter } from "src/api/InternalGroup";
import { getUsers } from "src/api/user";
import {
  getAllCustomerGroupEdit,
  getCustomerGroups,
} from "src/api/customerGroup";
import { Loading } from "quasar";
import BaseMultiOptions from "src/components/BaseMultiOptions.vue";
import { api } from "src/boot/axios";
import { transformTagPayload } from "src/utils/transform-object";

const statusOptions = ["published", "draft"];
const typeOptions = [
  { value: "group", label: "Group" },
  // { value: "personal", label: "Customer Service" },
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
const addedCustomerGroup = ref([]);
const deletedCustomerGroup = ref([]);
const selectedCustomerGroup = ref([]);
const addedUser = ref([]);
const deletedUser = ref([]);
const selectedUser = ref([]);
const openAddUser = ref(false);
const openAddCustomerGroup = ref(false);
const customerGroupData = ref([]);
const userData = ref([]);
const form = reactive({
  name: "",
  status: "",
  type: "group",
  loading: false,
});

onMounted(() => {
  if (data.value && props.id) {
    form.name = data.value.name;
    form.status = data.value.status;
    form.type = data.value.type;
    tags.value = data.value.tags.map((data) => ({
      label: data.tags_id.name,
      value: data.tags_id.id,
    }));
    selectedCustomerGroup.value = data.value?.customer_groups.map(
      (c) => c.customer_groups_id
    );
    selectedUser.value = data.value?.users.map((ug) => ug.directus_users_id);
  }
});
const options = reactive({
  tags: [],
});
const tags = ref([]);
const updateMultiOptions = async (val) => {
  const { data: payload, filterUrl, variableName, nameLabel } = val;
  const {
    data: { data },
  } = await api.get(filterUrl, {
    params: {
      fields: "*",
      search: payload,
    },
  });
  options[variableName] = data.map((item) => {
    return {
      value: item.id,
      label: item[nameLabel],
    };
  });
};
const deleteCustomerGroup = (index) => {
  const customerGroupId = selectedCustomerGroup.value[index].id;
  deletedCustomerGroup.value.push(customerGroupId);
  selectedCustomerGroup.value.splice(index, 1);
  addedCustomerGroup.value = addedCustomerGroup.value.filter(
    (data) => data.id !== customerGroupId
  );
};
const deleteUser = (index) => {
  const userId = selectedUser.value[index].id;
  deletedUser.value.push(userId);
  selectedUser.value.splice(index, 1);
  addedUser.value = addedUser.value.filter((data) => data.id !== userId);
};

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
  if (type === "user") {
    paginationUser.page = val;
    fetchUsers();
  } else {
    paginationCustomerGroup.page = val;
    fetchCustomerGroups();
  }
};
const Form = ref();
// Submitted Form
const submit = async () => {
  const validate = await Form.value.validate();
  if (!validate) return;
  if (props.id) {
    emits("submit", {
      form,
      tags: transformTagPayload(data.value, tags.value, "user_group_id"),
      customerGroups: {
        create: addedCustomerGroup.value.map((customerGroup) => ({
          user_groups_id: props.id,
          customer_groups_id: {
            id: customerGroup.id,
          },
        })),
        delete:
          (deletedCustomerGroup.value.length &&
            data.value.customer_groups
              .filter((customerGroup) =>
                deletedCustomerGroup.value.includes(
                  customerGroup.customer_groups_id.id
                )
              )
              .map((data) => data.id)) ||
          [],
      },
      users: {
        create: addedUser.value.map((user) => ({
          user_groups_id: props.id,
          directus_users_id: {
            id: user.id,
          },
        })),
        delete:
          (deletedUser.value.length &&
            data.value.users
              .filter((user) =>
                deletedUser.value.includes(user.directus_users_id.id)
              )
              .map((data) => data.id)) ||
          [],
      },
    });
  } else {
    emits("submit", {
      form,
      tags: transformTagPayload(data.value, tags.value, "user_group_id"),
      customerGroups: selectedCustomerGroup.value,
      users: selectedUser.value,
    });
  }
};
const submitAddCustomerGroup = async (val) => {
  if (val.length) {
    val.forEach((val) => {
      addedCustomerGroup.value.push(val);
      selectedCustomerGroup.value.push(val);
    });
  }
};
const submitAddUser = async (val) => {
  if (val.length) {
    val.forEach((val) => {
      addedUser.value.push(val);
      selectedUser.value.push(val);
    });
  }
};
const customerGroupQuery = ref("");
const searchCustomerGroupHandler = async (value) => {
  try {
    customerGroupQuery.value = value;
    await fetchCustomerGroups();
  } catch (error) {}
};
const sourceType = ref("div_no");
const cgType = ref("group");
const changeSource = (value) => {
  sourceType.value = value;
  paginationCustomerGroup.page = 1;
  fetchCustomerGroups();
};
const changeCgType = (value) => {
  cgType.value = value;
  paginationCustomerGroup.page = 1;
  fetchCustomerGroups();
};
const fetchCustomerGroups = async () => {
  const params = {
    limit: paginationCustomerGroup.rowsPerPage,
    page: paginationCustomerGroup.page,
    customerGroups: selectedCustomerGroup.value.map((item) => item.id),
    search: customerGroupQuery.value.length
      ? customerGroupQuery.value
      : undefined,
    source: cgType.value === "group" ? sourceType.value : undefined,
    type: cgType.value,
  };
  Loading.show();
  if (props.id) {
    const { data } = await getAllCustomerGroupEdit(params);
    customerGroupData.value = data.data;
    paginationCustomerGroup.totalCount = data.filter_count;
  } else {
    const { data } = await getCustomerGroups(params, props.id);
    customerGroupData.value = data.data;
    paginationCustomerGroup.totalCount = data.filter_count;
  }
  Loading.hide();
};
const userQuery = ref("");
const searchUserHandler = async (value) => {
  try {
    userQuery.value = value;
    await fetchUsers();
  } catch (error) {}
};
const fetchUsers = async () => {
  const params = {
    limit: paginationUser.rowsPerPage,
    page: paginationUser.page,
    search: userQuery.value.length ? userQuery.value : undefined,
  };
  if (props.id) {
    Loading.show();
    const {
      data: { data: users, meta },
    } = await getUsersFilter(
      params,
      selectedUser.value.map((item) => item.id)
    );
    Loading.hide();
    userData.value = users;
    paginationUser.totalCount = meta?.filter_count;
  } else {
    Loading.show();
    const {
      data: { data: users, meta },
    } = await getUsers(params);
    Loading.hide();
    userData.value = users;
    paginationUser.totalCount = meta?.filter_count;
  }
};

const paginationUser = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  totalCount: 0,
  filterCount: 0,
});
const paginationCustomerGroup = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  filterCount: 0,
  totalCount: 0,
});

const dialogSubmit = async () => {
  router.push({ name: "internal-group" });
};
</script>
