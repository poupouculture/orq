<template>
  <img src="../../assets/images/logo-invert.png" />
  <div class="row justify-end q-gutter-sm">
    <q-btn outline color="primary" label="Reassign" no-caps />
    <q-btn color="primary" label="Close Conversation" no-caps />
  </div>
  <div>
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
    <GeneralInformation />
  </div>
</template>

<script setup>
import { ref } from "vue";
import GeneralInformation from "src/components/Customer/GeneralInformation/index.vue";

const Tabs = Object.freeze({
  CUSTOMER: "customer",
  SERVICE_DETAIL: "serviceDetail",
  SERVICE_RECORD: "serviceRecord",
});

const CustomerInformationTabs = Object.freeze({
  GENERAL: "general",
  OTHER: "other",
});

const tab = ref(Tabs.CUSTOMER);
const customerInformationTab = ref(CustomerInformationTabs.GENERAL);
const inputGroup = ref("");
const toggle = ref(false);
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
