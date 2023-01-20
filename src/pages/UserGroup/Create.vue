<template>
  <!-- Heading -->
<<<<<<< HEAD
  <div
    class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5 xl:mt-8"
  >
    <q-icon name="keyboard_backspace" class="text-gray-400" />
    <RouterLink :to="{ name: 'customergroups' }" class="text-gray-400"
      >Customer Groups</RouterLink
    >
=======
  <div class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5 xl:mt-8">
    <q-icon name="keyboard_backspace" class="text-gray-400" />
    <RouterLink :to="{ name: 'customergroups' }" class="text-gray-400">Customer Groups</RouterLink>
>>>>>>> 992d3e5a4e2f95c396ee84753ed48cba54749a21
    <span>/</span>
    <span>Add Customer Groups</span>
  </div>
  <!-- Form -->
  <div class="q-pa-lg q-mt-lg bg-white rounded-lg">
    <div class="lg:w-10/12 mx-auto">
      <div class="row q-mb-lg q-gutter-xl">
        <div class="col">
          <p class="label-style">Name <span class="text-red-600">*</span></p>
<<<<<<< HEAD
          <q-input
            v-model="form.name"
            class="indi"
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
=======
          <q-input v-model="form.name" class="indi" :rules="[(val) => required(val)]" outlined lazy-rules dense />
        </div>
        <div class="col">
          <p class="label-style">Status</p>
          <q-select v-model="form.status" :options="statusOptions" :rules="[(val) => required(val)]" outlined lazy-rules
            dense />
>>>>>>> 992d3e5a4e2f95c396ee84753ed48cba54749a21
        </div>
      </div>
      <!-- Customer -->
      <h6 class="border-b border-[#D9D9D9]">Customers</h6>
      <div class="flex justify-end items mt-2.5 space-x-3">
        <p class="text-[#9A9AAF]">{{ selectedCustomer.length }} Items</p>
<<<<<<< HEAD
        <RouterLink
          :to="{ name: 'customergroups.create', query: { add_customer: true } }"
          class="bg-primary rounded-md flex p-0.5 shadow drop-shadow-lg shadow-blue-700/40"
        >
=======
        <RouterLink :to="{ name: 'customergroups.create', query: { add_customer: true } }"
          class="bg-primary rounded-md flex p-0.5 shadow drop-shadow-lg shadow-blue-700/40">
>>>>>>> 992d3e5a4e2f95c396ee84753ed48cba54749a21
          <q-icon name="add" class="text-white" size="1.2rem" />
        </RouterLink>
      </div>
      <!-- User Groups -->
      <h6 class="border-b border-[#D9D9D9]">User Group</h6>
      <div class="flex justify-end items mt-2.5 space-x-3">
        <p class="text-[#9A9AAF]">{{ selectedUserGroup.length }} Items</p>
<<<<<<< HEAD
        <RouterLink
          :to="{
            name: 'customergroups.create',
            query: { add_user_group: true },
          }"
          class="bg-primary rounded-md flex p-0.5 shadow drop-shadow-lg shadow-blue-700/40"
        >
=======
        <RouterLink :to="{ name: 'customergroups.create', query: { add_user_group: true } }"
          class="bg-primary rounded-md flex p-0.5 shadow drop-shadow-lg shadow-blue-700/40">
>>>>>>> 992d3e5a4e2f95c396ee84753ed48cba54749a21
          <q-icon name="add" class="text-white" size="1.2rem" />
        </RouterLink>
      </div>
      <!-- Button Action -->
      <div class="row q-mb-lg q-gutter-xl q-mt-lg">
        <div class="col flex">
          <div class="btn-dotted" @click="returnDialog = true">
            <p>Return</p>
          </div>
        </div>
        <div class="col flex justify-end">
<<<<<<< HEAD
          <q-btn
            :loading="form.loading"
            color="primary"
            label="Save"
            class="dark-btn"
            @click="submit()"
          />
=======
          <q-btn :loading="form.loading" color="primary" label="Save" class="dark-btn" @click="submit()" />
>>>>>>> 992d3e5a4e2f95c396ee84753ed48cba54749a21
        </div>
      </div>
    </div>
  </div>
  <!-- Overlay Add Customer -->
<<<<<<< HEAD
  <AddCustomerOverlay
    v-if="$route.query.add_customer"
    v-model="selectedCustomer"
  />
  <AddUserGroupOverlay
    v-if="$route.query.add_user_group"
    v-model="selectedUserGroup"
  />
  <ReturnDialog
    v-model="returnDialog"
    @cancel="returnDialog = false"
    @keepEditing="returnDialog = false"
    @submit="dialogSubmit()"
  />
=======
  <AddCustomerOverlay v-if="$route.query.add_customer" v-model="selectedCustomer" />
  <AddUserGroupOverlay v-if="$route.query.add_user_group" v-model="selectedUserGroup" />
  <ReturnDialog v-model="returnDialog" @cancel="returnDialog = false" @keepEditing="returnDialog = false"
    @submit="dialogSubmit()" />
>>>>>>> 992d3e5a4e2f95c396ee84753ed48cba54749a21
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { required } from "src/utils/validation-rules.js";
import ReturnDialog from "src/components/Dialogs/ReturnDialog.vue";
import AddUserGroupOverlay from "src/components/UserGroup/AddUserGroupOverlay.vue";
import AddCustomerOverlay from "src/components/UserGroup/AddCustomerOverlay.vue";
<<<<<<< HEAD
import { addCustomerGroup } from "src/api/customerGroup";
import { Notify } from "quasar";

const router = useRouter();
const returnDialog = ref(false);
const selectedCustomer = ref([]);
const selectedUserGroup = ref([]);
const form = reactive({
  name: "",
  status: "",
  loading: false,
});

const submit = async () => {
  form.loading = true;
=======
import { addCustomerGroup } from "src/api/customerGroup"
import { Notify } from "quasar";

const router = useRouter();
const returnDialog = ref(false)
const selectedCustomer = ref([])
const selectedUserGroup = ref([])
const form = reactive({
  name: "",
  status: "",
  loading: false
})

const submit = async () => {
  form.loading = true
>>>>>>> 992d3e5a4e2f95c396ee84753ed48cba54749a21
  try {
    await addCustomerGroup({
      ...form,
      user_groups: {
<<<<<<< HEAD
        create: userGroupCreate(),
      },
      customers: {
        create: customerCreate(),
      },
    });
    Notify.create("Customer Group successfully created!");
    router.replace({ name: "customergroups" });
  } catch (error) {}
  form.loading = false;
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
=======
        create: userGroupCreate()
      },
      customers: {
        create: customerCreate()
      },
    })
    Notify.create('Customer Group successfully created!')
    router.replace({ name: 'customergroups' })
  } catch (error) { }
  form.loading = false
}
const customerCreate = () => {
  return selectedCustomer.value.map(customer => {
    return {
      customer_groups_id: "+",
      customers_id: customer.id,
    }
  })
}
const userGroupCreate = () => {
  return selectedUserGroup.value.map(userGroup => {
    return {
      customer_groups_id: "+",
      user_groups_id: userGroup.id,
    }
  })
}
>>>>>>> 992d3e5a4e2f95c396ee84753ed48cba54749a21
const statusOptions = ["published", "draft"];

const dialogSubmit = async () => {
  router.push({ name: "customergroups" });
};
</script>
