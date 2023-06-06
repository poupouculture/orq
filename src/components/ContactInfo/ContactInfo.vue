<script setup lang="ts">
import { ref } from "vue";
import useContactStore from "src/stores/modules/contact";
import useMessagingStore from "src/stores/modules/messaging";
import useCustomerStore from "src/stores/modules/customer";
import { storeToRefs } from "pinia";

// State
const editMode = ref(false);
const categoryOptions = ref(["phone"]);
const statusOptions = ref(["Active"]);
const messagingStore = useMessagingStore();
const customerStore = useCustomerStore();

const contacts = useContactStore();
const { getContacts, getCurrentCustomerId } = storeToRefs(contacts);

const dissociateContact = async () => {
  await contacts.dissociateContact();

  await messagingStore.fetchChats();

  customerStore.setCustomer(null);
};

const updateContacts = async () => {
  await contacts.updateContact(getContacts.value);

  editMode.value = false;
};
</script>
<template>
  <div class="flex flex-col">
    <div
      :class="[
        getCurrentCustomerId ? 'justify-between' : 'justify-end',
        'flex mb-4',
      ]"
    >
      <q-btn
        v-if="getCurrentCustomerId"
        @click="dissociateContact"
        label="dissociate contact"
        color="primary"
      />
      <q-btn
        @click="editMode = !editMode"
        :color="editMode ? 'red-6' : 'primary'"
        :outline="editMode"
        class=""
        :label="editMode ? 'cancel' : 'edit'"
      />
    </div>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div class="flex flex-col">
        <p class="label-style">First Name</p>
        <q-input
          outlined
          v-model="getContacts.first_name"
          :disable="!editMode"
          dense
        />
      </div>

      <div class="flex flex-col">
        <p class="label-style">Last Name</p>
        <q-input
          outlined
          v-model="getContacts.last_name"
          :disable="!editMode"
          dense
        />
      </div>

      <div class="flex flex-col">
        <p class="label-style">Number</p>
        <q-input outlined v-model="getContacts.number" disable dense />
        <q-checkbox
          :disable="!editMode"
          :true-value="true"
          v-model="getContacts.is_active"
          :false-value="false"
          label="Contact is Active"
        />
      </div>

      <div class="flex flex-col">
        <p class="label-style">Category</p>
        <q-select
          outlined
          :disable="!editMode"
          dense
          v-model="getContacts.category"
          lazy-rules
          :options="categoryOptions"
        />
      </div>

      <div class="flex flex-col">
        <p class="label-style">Status</p>
        <q-select
          v-model="getContacts.status"
          :options="statusOptions"
          dense
          outlined
          :disable="!editMode"
        />
      </div>
    </div>

    <div v-if="editMode" class="flex justify-end">
      <q-btn @click="updateContacts" color="primary" label="Save" />
    </div>
  </div>
</template>

<style scoped>
.label-style {
  font-family: "Archivo";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;

  color: #2e2e3a;
  margin-bottom: 10px;
}
</style>
