<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import useContactStore from "src/stores/modules/contact";
import useMessagingStore from "src/stores/modules/messaging";
import useCustomerStore from "src/stores/modules/customer";
import { storeToRefs } from "pinia";
import { preferedLanguageOptions } from "src/utils/typeOptions";
import { api } from "src/boot/axios";
import BaseMultiOptions from "../BaseMultiOptions.vue";

// Props
const props = defineProps({
  showAssociateButton: {
    type: Boolean,
    default: () => true,
  },
  // this for select contacts options
  showContactsInput: {
    type: Boolean,
    default: () => false,
  },
});
// State
const editMode = ref(false);
const categoryOptions = ref(["phone"]);
// const statusOptions = ref(["Active"]);
const messagingStore = useMessagingStore();
const customerStore = useCustomerStore();
const { getSelectedChat } = storeToRefs(messagingStore);
const { getCustomer } = storeToRefs(customerStore);

const contacts = useContactStore();
const { getContacts, getCurrentCustomerId } = storeToRefs(contacts);

const dissociateContact = async () => {
  await contacts.dissociateContact();
  if (messagingStore.getSelectedChat) {
    messagingStore.clearChatCustomer();
  }
  // await messagingStore.fetchChats();
  customerStore.setCustomer(null);
};
const form = ref({
  id: getContacts.value?.id || "",
  first_name: getContacts.value?.first_name || "",
  last_name: getContacts.value?.last_name || "",
  number: getContacts.value?.number || "",
  category: getContacts.value?.category || "",
  preferred_language: getContacts.value?.preferred_language || "",
});
const editAction = () => {
  editMode.value = !editMode.value;
  if (!editMode.value && getContacts.value && !props.showContactsInput) {
    setForm(getContacts.value);
  }
};
const setForm = (val: any) => {
  form.value.first_name = val.first_name;
  form.value.last_name = val.last_name;
  form.value.number = val.number;
  form.value.category = val.category;
  form.value.preferred_language = val.preferred_language;
};
const selectedContact = ref(null) as any;
const options = reactive({
  contacts: [],
}) as any;
watch(getContacts, (val: any) => {
  if (val) {
    form.value = val;
  } else {
    resetForm();
  }
});
watch(selectedContact, (val: any) => {
  if (val) {
    form.value = val.value;
  } else {
    resetForm();
  }
});
const updateMultiOptions = async (val: any) => {
  const { data: payload, filterUrl, variableName } = val;
  const response = await api.get(filterUrl, {
    params: {
      fields: "*",
      search: payload,
      "filter[_and][0][customers][customers_id][id][_eq]": getCustomer.value.id,
    },
  });
  options[variableName] = response.data.data.map((item: any) => {
    return {
      value: item,
      label: `${item.first_name} ${item.last_name} (${item.number})`,
    };
  });
};
const resetForm = () => {
  form.value.first_name = "";
  form.value.last_name = "";
  form.value.number = "";
  form.value.category = "";
  form.value.preferred_language = "";
};
const updateContacts = async () => {
  await contacts.updateContact(form.value);

  if (getSelectedChat.value) {
    getSelectedChat.value.contact_first_name = form.value.first_name;
    getSelectedChat.value.contact_last_name = form.value.last_name;
  }
  // set selected contact
  if (props.showContactsInput) {
    selectedContact.value.value = form.value;
    selectedContact.value.label = `${form.value.first_name} ${form.value.last_name} (${form.value.number})`;
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
        @click="editAction()"
        :color="editMode ? 'red-6' : 'primary'"
        :outline="editMode"
        :label="editMode ? 'cancel' : 'edit'"
      />
    </div>

    <div class="flex flex-col lg:w-1/3" v-if="showContactsInput">
      <BaseMultiOptions
        v-model="selectedContact"
        label="Select Contact"
        filter-url="/items/contacts"
        :options="options.contacts"
        option-variable-name="contacts"
        :multiple="false"
        @update:multi-options="updateMultiOptions"
      />
    </div>
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div class="flex flex-col">
        <p class="label-style">First Name</p>
        <q-input
          outlined
          v-model="form.first_name"
          :disable="!editMode"
          dense
        />
      </div>

      <div class="flex flex-col">
        <p class="label-style">Last Name</p>
        <q-input outlined v-model="form.last_name" :disable="!editMode" dense />
      </div>

      <div class="flex flex-col">
        <p class="label-style">Number</p>
        <q-input outlined v-model="form.number" disable dense />
        <!-- <q-checkbox
          :disable="true"
          :true-value="true"
          v-model="form.is_active"
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
          v-model="form.category"
          lazy-rules
          :options="categoryOptions"
        />
      </div>

      <div class="flex flex-col">
        <p class="label-style">Prefered Language</p>
        <q-select
          v-model="form.preferred_language"
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
