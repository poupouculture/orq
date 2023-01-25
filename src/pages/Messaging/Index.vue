<template>
  <div class="row justify-end q-gutter-sm">
    <q-btn outline color="primary" label="Reassign" no-caps />
    <q-btn color="primary" label="Close Conversation" no-caps />
  </div>
  <div>
    <div v-if="newCustomer">
      <div class="text-weight-medium">New Contact</div>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey q-mt-md"
        align="left"
        active-color="primary"
        indicator-color="primary"
        narrow-indicator
        no-caps
        inset
      >
        <q-tab name="customer" label="Customer" />
        <q-tab name="serviceDetail" label="Service Detail" />
        <q-tab name="serviceRecord" label="Service Record" />
      </q-tabs>
      <q-separator size="2px" style="margin-top: -2px" />
      <q-card class="q-py-md q-px-lg q-mt-md bg-grey-2" flat>
        User Group
        <q-card class="bg-white q-mt-sm row" flat>
          <q-btn label="Name" class="row text-grey-8" unelevated no-caps>
            <img src="../../assets/images/dropdown.png" class="dropdown-img" />
            <q-menu class="q-ma-lg" style="width: 400px">
              <div class="column"></div>
            </q-menu>
          </q-btn>
          <q-separator spaced vertical inset />
          <q-input
            v-model="inputGroup"
            class="col-8"
            placeholder="Public Group - Only Managers"
            dense
            borderless
          />
          <q-btn class="row no-hover-btn" unelevated no-caps>
            <img src="../../assets/images/dropdown.png" />
          </q-btn>
          <q-separator spaced vertical inset />
          <q-toggle v-model="toggle" color="primary" />
        </q-card>
      </q-card>
    </div>
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
    </q-tabs>
    <q-separator size="2px" style="margin-top: -2px" />
    <GeneralInformation
      :show-active="false"
      :show-return-button="false"
      :show-delete-button="false"
      @submit="saveCustomer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import useCustomerStore from "src/stores/modules/customer";
import useMessagingStore from "src/stores/modules/messaging";
import GeneralInformation from "src/components/Customer/GeneralInformation/index.vue";
import { FormPayload } from "src/types/CustomerTypes";
const enum Tabs {
  CUSTOMER = "customer",
  SERVICE_DETAIL = "serviceDetail",
  SERVICE_RECORD = "serviceRecord",
}
const enum CustomerInformationTabs {
  GENERAL = "general",
  OTHER = "other",
}
const customerStore = useCustomerStore();
const messagingStore = useMessagingStore();
const tab: Ref<Tabs> = ref(Tabs.CUSTOMER);
const customerInformationTab: Ref<CustomerInformationTabs> = ref(
  CustomerInformationTabs.GENERAL
);
const inputGroup: Ref<string> = ref("");
const toggle: Ref<boolean> = ref(false);
const newCustomer: Ref<boolean> = ref(false);
const { getChats, getSelectedChatIndex } = storeToRefs(messagingStore);
const saveCustomer = async (val: FormPayload) => {
  if (customerStore.getCustomer.id) {
    // update
    customerStore.updateCustomer(customerStore.getCustomer.id, val);
  } else {
    // insert
    const selectedChat = getChats.value[getSelectedChatIndex.value];
    const contactId = selectedChat.contacts_id;
    const customer = await customerStore.addCustomer(val);
    customerStore.addCustomerContact(customer.id, contactId);
  }
};
</script>

<style scoped>
.dropdown-img {
  margin-left: 10px;
  width: 10px;
  height: 6.5px;
  cursor: pointer;
}
.no-hover-btn:active,
.no-hover-btn:focus,
.no-hover-btn:hover {
  background-color: transparent !important;
  color: transparent;
}
</style>
