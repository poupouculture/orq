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
    <span>Add Internal Group</span>
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
    v-model="selectedCustomerGroup"
  />
  <ReturnDialog
    v-model="returnDialog"
    @cancel="returnDialog = false"
    @keepEditing="returnDialog = false"
    @submit="dialogSubmit()"
  />
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { required } from "src/utils/validation-rules.ts";
import ReturnDialog from "src/components/Dialogs/ReturnDialog.vue";
import AddCustomerGroupOverlay from "src/components/InternalGroup/AddCustomerGroupOverlay.vue";
import AddUserOverlay from "src/components/InternalGroup/AddUserOverlay.vue";
import { addInternalGroup } from "src/api/InternalGroup";
import { Notify } from "quasar";

const router = useRouter();
const returnDialog = ref(false);
const selectedUser = ref([]);
const selectedCustomerGroup = ref([]);
const openUserOverlay = ref(false);
const openCustomerGroupOverlay = ref(false);
const statusOptions = ["published", "draft"];
const typeOptions = [
  { value: "manager", label: "Manager" },
  { value: "cs", label: "Customer Service" },
];
const form = reactive({
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
    await addInternalGroup({
      ...form,
      users: {
        create: userCreate(),
      },
      customer_groups: {
        create: customerGroupCreate(),
      },
    });
    Notify.create("Internal Group successfully created!");
    router.replace({ name: "customergroups-internal-group" });
  } catch (error) {}
  form.loading = false;
};
const userCreate = () => {
  return selectedUser.value.map((user) => ({
    user_groups_id: "+",
    directus_users_id: user,
  }));
};
const customerGroupCreate = () => {
  return selectedCustomerGroup.value.map((customerGroup) => ({
    user_groups_id: "+",
    customer_groups_id: customerGroup,
  }));
};

const dialogSubmit = async () => {
  router.push({ name: "customergroups-internal-group" });
};
</script>
