<template>
  <div class="q-pa-lg q-mt-lg" style="background: white; border-radius: 6px">
    <div style="max-width: 1000px">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        no-caps
      >
        <q-tab name="general" label="General Information" />
        <!-- <q-tab name="otherInformation" label="Other Information" /> -->
        <q-tab name="contact" label="Contact Information" />
        <!-- <q-tab name="remark" label="Remark" />
        <q-tab name="attachment" label="Attachment" />
        <q-tab name="record" label="Service Record" /> -->
      </q-tabs>

      <q-separator class="seperator-class" />
      <div class="pannels-holder">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="general" class="pannel-each">
            <GeneralInformation
              @discard="$emit('discard')"
              @delete="$emit('deleteGeneralInformation')"
              @submit="submitGeneralInformation"
              :show-delete-button="showDeleteButton"
              :mode="mode"
            />
          </q-tab-panel>

          <q-tab-panel name="otherInformation">
            <!-- <OtherInformation /> -->
          </q-tab-panel>

          <q-tab-panel name="contact">
            <div class="contact-info">
              <ContactInfo
                :show-associate-button="showAssociateButton"
                :show-contacts-input="showContactsInput"
              />
            </div>
          </q-tab-panel>
          <!-- ??? 0614 -->
          <!-- <q-tab-panel name="remark">
            <Remark v-model.modelValue="remarks" />
          </q-tab-panel>

          <q-tab-panel name="Attachement">
            <Attachement />
          </q-tab-panel>
          <q-tab-panel name="record">
            <ServiceRecord />
          </q-tab-panel> -->
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ContactInfo from "../ContactInfo/ContactInfo.vue";
import GeneralInformation from "src/components/Customer/GeneralInformation/index.vue";
// import ServiceRecord from "./ServiceRecord.vue";
// import OtherInformation from "../OtherInformation/OtherInformation.vue";
// import Remark from "../Remark/Remark.vue";
import useCustomerStore from "src/stores/modules/customer";
// import Attachement from "../Attachement/Attachement.vue";
defineProps({
  mode: {
    type: String,
    default: "edit",
  },
  showDeleteButton: {
    type: Boolean,
    default: true,
  },
  showAssociateButton: {
    type: Boolean,
    default: true,
  },
  showContactsInput: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits([
  "submitGeneralInformation",
  "deleteGeneralInformation",
  "discard",
]);
const customerStore = useCustomerStore();
const tab = ref("general");

const remarks = ref(customerStore.customer.remarks || "");
const submitGeneralInformation = (payload) => {
  payload.remarks = remarks.value;
  emit("submitGeneralInformation", payload);
};
</script>
