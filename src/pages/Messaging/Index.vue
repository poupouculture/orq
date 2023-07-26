<template>
  <div class="lg:!block">
    <q-btn
      class="float-right"
      @click="closeCustomerInfoMobile"
      style="color: #64748b"
      flat
      round
      icon="close"
    />
    <!-- Search Customer -->
    <SearchCustomer />
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
    <!-- Customer Information Tabs -->
    <CustomerInformationTabs />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import type { Ref } from "vue";
import SearchCustomer from "src/components/Messaging/SearchCustomer.vue";
import useMessagingStore from "src/stores/modules/messaging";
import CustomerInformationTabs from "src/components/Messaging/CustomerInformationTabs.vue";

const enum Tabs {
  CUSTOMER = "customer",
  SERVICE_DETAIL = "serviceDetail",
  SERVICE_RECORD = "serviceRecord",
}
const messagingStore = useMessagingStore();
const tab: Ref<Tabs> = ref(Tabs.CUSTOMER);
const inputGroup: Ref<string> = ref("");
const toggle: Ref<boolean> = ref(false);
const newCustomer: Ref<boolean> = ref(false);
const rightDrawerOpen: any = inject("rightDrawerOpen");

onMounted(async () => {
  messagingStore.getWabaUsers();
});

const closeCustomerInfoMobile = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
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
