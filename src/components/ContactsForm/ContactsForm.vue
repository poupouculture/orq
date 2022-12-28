<template>
  <div class="">
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
        <q-tab name="General-information" label="General Information" />
        <q-tab name="Other-Information" label="Other Information" />
        <q-tab name="Contact-Information" label="Contact Information" />
        <q-tab name="Remark" label="Remark" />
        <q-tab name="Attachement" label="Attachement" />
        <q-tab name="Record" label="Service Record" />
      </q-tabs>

      <q-separator class="seperator-class" />
      <div class="pannels-holder">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="General-information" class="pannel-each">
            <GeneralInformation />
          </q-tab-panel>

          <q-tab-panel name="Other-Information">
            <OtherInformation />
          </q-tab-panel>

          <q-tab-panel name="Contact-Information">
            <div class="contact-info">
              <ContactInfo />
            </div>
          </q-tab-panel>

          <q-tab-panel name="Remark">
            <Remark />
          </q-tab-panel>

          <q-tab-panel name="Attachement">
            <Attachement />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ContactInfo from "../ContactInfo/ContactInfo.vue";
import GeneralInformation from "../GeneralInformation/GeneralInformation.vue";
import OtherInformation from "../OtherInformation/OtherInformation.vue";
import Remark from "../Remark/Remark.vue";
import Attachement from "../Attachement/Attachement.vue";

const tab = ref("General-information");
</script>
