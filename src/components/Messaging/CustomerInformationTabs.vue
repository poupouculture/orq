<template>
  <q-tabs
    v-model="customerInformationTab"
    dense
    class="text-grey q-mt-md"
    align="left"
    active-color="primary"
    indicator-color="primary"
    narrow-indicator
    no-caps
    inset
  >
    <q-tab name="general" label="General Information" />
    <q-tab name="other" label="Other Information" />
    <q-tab name="service_record" label="Service Record" />
  </q-tabs>
  <q-separator size="2px" style="margin-top: -2px" />
  <q-tab-panels v-model="customerInformationTab" animated>
    <q-tab-panel name="general" class="pannel-each">
      <GeneralInformation
        :mode="isContactNumberExist ? '' : 'show'"
        :show-active="false"
        :show-return-button="false"
        :show-delete-button="false"
        @submit="saveCustomer"
      />
    </q-tab-panel>
    <q-tab-panel name="service_record">
      <ServiceRecord />
    </q-tab-panel>
  </q-tab-panels>
</template>
<script setup lang="ts">
import GeneralInformation from "src/components/Customer/GeneralInformation/index.vue";
import useCustomerStore from "src/stores/modules/customer";
import useMessagingStore from "src/stores/modules/messaging";
import { FormPayload } from "src/types/CustomerTypes";
import { computed, ref } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import ServiceRecord from "../Customer/ServiceRecord.vue";
const enum CustomerInformationTabs {
  GENERAL = "general",
  OTHER = "other",
  SERVICE_RECORD = "service_record",
}
const customerStore = useCustomerStore();
const messagingStore = useMessagingStore();
const { getSelectedChat } = storeToRefs(messagingStore);
const isContactNumberExist = computed(
  () => messagingStore.isContactNumberExist
);
const customerInformationTab: Ref<CustomerInformationTabs> = ref(
  CustomerInformationTabs.GENERAL
);
const saveCustomer = async (val: FormPayload) => {
  let customer = null;
  if (customerStore.getCustomer.id) {
    // update
    await customerStore.updateCustomer(customerStore.getCustomer.id, val);
    customer = customerStore.getCustomer;
  } else {
    // insert
    customer = await customerStore.addCustomer(val);
    const contactId = getSelectedChat.value.contacts_id;
    await customerStore.addCustomerContact(customer.id, contactId);
  }

  messagingStore.fetchChats();
};
</script>
