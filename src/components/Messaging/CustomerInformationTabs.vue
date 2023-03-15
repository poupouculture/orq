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
    <q-tab name="contact" label="Contact Information" />
    <q-tab name="service_record" label="Service Record" />
  </q-tabs>
  <q-separator size="2px" style="margin-top: -2px" />
  <q-tab-panels v-model="customerInformationTab" animated>
    <q-tab-panel name="general" class="pannel-each">
      <GeneralInformation
        mode="show"
        :show-active="false"
        :show-return-button="false"
        :show-delete-button="false"
        @submit="saveCustomer"
      />
    </q-tab-panel>
    <q-tab-panel name="contact">
      <div class="contact-info">
        <ContactInfo :customer-id="customerStore.getCustomer.id" />
      </div>
    </q-tab-panel>
    <q-tab-panel name="service_record">
      <ServiceRecord />
    </q-tab-panel>
  </q-tab-panels>
</template>
<script setup lang="ts">
import GeneralInformation from "src/components/Customer/GeneralInformation/index.vue";
import ServiceRecord from "../Customer/ServiceRecord.vue";
import ContactInfo from "../ContactInfo/ContactInfo.vue";
import useCustomerStore from "src/stores/modules/customer";
import useMessagingStore from "src/stores/modules/messaging";
import { FormPayload } from "src/types/CustomerTypes";
import { ref, computed } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
const enum CustomerInformationTabs {
  GENERAL = "general",
  OTHER = "other",
  SERVICE_RECORD = "service_record",
}
const customerStore = useCustomerStore();
const customer = computed(() => customerStore.getCustomer);
const messagingStore = useMessagingStore();
const { getSelectedChat } = storeToRefs(messagingStore);
const customerInformationTab: Ref<CustomerInformationTabs> = ref(
  CustomerInformationTabs.GENERAL
);
const saveCustomer = async (val: FormPayload) => {
  let customerResult = null;
  if (customer.value.id) {
    // update
    await customerStore.updateCustomer(customer.value.id, val);
    customerResult = customerStore.getCustomer;
  } else {
    // insert
    customerResult = await customerStore.addCustomer(val);
    if (!customerResult?.data?.errors) {
      const contactId = getSelectedChat.value.contacts_id;
      await customerStore.addCustomerContact(
        customerResult?.data.data.id,
        contactId
      );
    }
  }

  messagingStore.fetchChats();
};
</script>
