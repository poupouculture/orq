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
    <q-tab
      v-for="(item, index) in tabs"
      :key="index"
      :name="item.name"
      :label="item.label"
    />
  </q-tabs>
  <q-separator size="2px" style="margin-top: -2px" />
  <q-tab-panels keep-alive v-model="customerInformationTab" animated>
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
      <div class="">
        <ContactInfo :customer-id="customerStore.getCustomer.id" />
      </div>
    </q-tab-panel>

    <q-tab-panel name="remark">
      <Remark v-model.modelValue="remarks" v-model:mode="remarkMode" />
    </q-tab-panel>

    <q-tab-panel name="other">
      <div class="contact-info">Other Information</div>
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
import Remark from "src/components/Remark/Remark.vue";
import useMessagingStore from "src/stores/modules/messaging";
import { FormPayload } from "src/types/CustomerTypes";
import { updateCustomer, addCustomer } from "src/api/customers";
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";

const customerStore = useCustomerStore();
const messagingStore = useMessagingStore();
const { getSelectedChat } = storeToRefs(messagingStore);
const customer = computed(() => customerStore.getCustomer);
const remarks = ref("");
const remarkMode = ref("show");
watch(customer, (val) => {
  remarks.value = (val.remarks as string) || "";
});

const customerInformationTab = ref("general");
const tabs = ref([
  {
    name: "general",
    label: "General Information",
  },
  // {
  //   name: "other",
  //   label: "Other Information",
  // },
  {
    name: "contact",
    label: "Contact",
  },
  {
    name: "remark",
    label: "Remark",
  },
  {
    name: "service_record",
    label: "Service Record",
  },
]);

// Methods
const saveCustomer = async (val: FormPayload) => {
  val.remarks = remarks.value;
  if (getSelectedChat.value.customers_id) {
    // update
    await customerStore.updateCustomer(getSelectedChat.value.customers_id, val);
  } else {
    // insert
    if (customer.value.id) {
      await updateCustomer(customer.value.id, val);
    } else {
      await addCustomer(val);
    }
  }

  messagingStore.fetchChats();
};
</script>
