<script setup lang="ts">
import { ref, watch } from "vue";
import useContactStore from "src/stores/modules/contact";
import useMessagingStore from "src/stores/modules/messaging";
import useCustomerStore from "src/stores/modules/customer";
import { storeToRefs } from "pinia";
import { preferedLanguageOptions } from "src/utils/typeOptions";

// Props
defineProps({
  showAssociateButton: {
    type: Boolean,
    default: () => true,
  },
});
// State
const editMode = ref(false);
const categoryOptions = ref(["phone"]);
// const statusOptions = ref(["Active"]);
const messagingStore = useMessagingStore();
const customerStore = useCustomerStore();
const { getSelectedChat } = storeToRefs(messagingStore);

const contacts = useContactStore();
const { getContacts, getCurrentCustomerId } = storeToRefs(contacts);

const dissociateContact = async () => {
  const response = await contacts.dissociateContact();
  console.log(response);
  if (messagingStore.getSelectedChat) {
    messagingStore.clearChatCustomer();
  }
  // await messagingStore.fetchChats();

  customerStore.setCustomer(null);
};
watch(getContacts, () => {
  editMode.value = false;
});
const updateContacts = async () => {
  await contacts.updateContact(getContacts.value);

  if (getSelectedChat.value) {
    getSelectedChat.value.contact_first_name = getContacts.value.first_name;
    getSelectedChat.value.contact_last_name = getContacts.value.last_name;
  }
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
        <!-- <q-checkbox
          :disable="true"
          :true-value="true"
          v-model="getContacts.is_active"
          :false-value="false"
          label="Contact is Active"
        /> -->
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
        <p class="label-style">Prefered Language</p>
        <q-select
          v-model="getContacts.preferred_language"
          :options="preferedLanguageOptions"
          dense
          outlined
          map-options
          emit-value
          option-value="value"
          option-label="label"
          :disable="true"
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
