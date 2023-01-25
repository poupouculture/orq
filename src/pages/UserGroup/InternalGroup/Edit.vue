<template>
  <!-- Heading -->
  <div
    class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5 xl:mt-8"
  >
    <RouterLink
      :to="{ name: 'customergroups-internal-group' }"
      class="text-gray-400 gap-x-3"
    >
      <q-icon name="keyboard_backspace" class="text-gray-400" />
      Internal Groups</RouterLink
    >
    <span>/</span>
    <span>Edit Internal Group</span>
  </div>
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
            @click="openUserOverlay = true"
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
            @click="openCustomerGroupOverlay = true"
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
  <AddUserOverlay
    v-if="openUserOverlay"
    @close="openUserOverlay = false"
    v-model="selectedUser"
  />
  <AddCustomerGroupOverlay
    v-if="openCustomerGroupOverlay"
    @close="openCustomerGroupOverlay = false"
    :data="selectedCustomerGroup"
    @save="(val) => (selectedCustomerGroup = val)"
  />
  <ReturnDialog
    v-model="returnDialog"
    @cancel="returnDialog = false"
    @keepEditing="returnDialog = false"
    @submit="dialogSubmit()"
  />
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { required } from "src/utils/validation-rules.ts";
import ReturnDialog from "src/components/Dialogs/ReturnDialog.vue";
import AddCustomerGroupOverlay from "src/components/InternalGroup/AddCustomerGroupOverlay.vue";
import AddUserOverlay from "src/components/InternalGroup/AddUserOverlay.vue";
// import { updateInternalGroup, getInternalGroup } from "src/api/InternalGroup";
import { getInternalGroup } from "src/api/InternalGroup";
// import { Notify } from "quasar";

const router = useRouter();
const returnDialog = ref(false);
const openCustomerGroupOverlay = ref(false);
const openUserOverlay = ref(false);
const selectedUser = ref([]);
const selectedCustomerGroup = ref([]);
const statusOptions = ["published", "draft"];
const typeOptions = [
  { value: "manager", label: "Manager" },
  { value: "cs", label: "Customer Service" },
];
const form = reactive({
  id: useRoute().params.id,
  name: "",
  status: "",
  loading: false,
  type: "manager",
});
const formCreate = ref();
const submit = async () => {
  const validate = await formCreate.value.validate();
  if (!validate) return;
  form.loading = true;
  try {
    // return;
    // eslint-disable-next-line no-unreachable
    // await updateInternalGroup({
    //   ...form,
    //   users: {
    //     create: userCreate().filter(
    //       (user) => !oldSelectedUser.value.includes(user.id)
    //     ),
    //   },
    //   customer_groups: {
    //     create: customerGroupCreate().filter(
    //       (group) => !oldSelectedCustomerGroup.value.includes(group.id)
    //     ),
    //   },
    // });
    // Notify.create("Internal Group successfully edited!");
    // router.replace({ name: "customergroups-internal-group" });
  } catch (error) {}
  form.loading = false;
};
// const userCreate = () => {
//   return selectedUser.value.map((user) => {
//     return {
//       user_groups_id: form.id,
//       directus_users_id: user.id,
//     };
//   });
// };
// const customerGroupCreate = () => {
//   return selectedCustomerGroup.value.map((customerGroup) => {
//     return {
//       user_groups_id: form.id,
//       customer_groups_id: customerGroup.id,
//     };
//   });
// };
const oldSelectedUser = ref();
const oldSelectedCustomerGroup = ref();
onMounted(async () => {
  const {
    data: { data },
  } = await getInternalGroup(useRoute().params.id);
  form.name = data.name;
  form.type = data.type;
  form.status = data.status;
  selectedUser.value = data.users.map(
    // eslint-disable-next-line camelcase
    ({ directus_users_id }) => directus_users_id.id
  );
  oldSelectedUser.value = selectedUser.value;
  selectedCustomerGroup.value = data.customer_groups
    .map((data) => data.customer_groups_id)
    .filter((item) => item !== null);
  oldSelectedCustomerGroup.value = selectedCustomerGroup.value;
});
const dialogSubmit = async () => {
  router.push({ name: "customergroups-internal-group" });
};
</script>
