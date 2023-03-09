<script setup lang="ts">
import CompanyInformation from "src/components/Order/Invoice/companyInformation.vue";
import CustomerInformation from "components/Order/Invoice/customerInformation.vue";
import InvoiceInformation from "components/Order/Invoice/invoiceInformation.vue";
import { computed, ref } from "vue";

const activeTabs = ref("companyInformation");

const tabs = computed(() => {
  return [
    {
      label: "Company Information",
      component: CompanyInformation,
      value: "companyInformation",
    },
    {
      label: "Customer Information",
      component: CustomerInformation,
      value: "customerInformation",
    },
    {
      label: "Invoice Information",
      component: InvoiceInformation,
      value: "invoiceInformation",
    },
  ];
});
</script>

<template>
  <div class="grid grid-cols-2 gap-10">
    <div class="grid bg-white grid-rows-2">
      <div class="pb-3">
        <p class="text-capitalize text-[#111827] font-semibold text-2xl">
          new invoice
        </p>
      </div>

      <div class="">
        <q-tabs
          v-model="activeTabs"
          dense
          align="left"
          active-color="primary"
          narrow-indicator
        >
          <q-tab
            v-for="(tab, index) in tabs"
            :key="index"
            :name="tab.value"
            :label="tab.label"
          />
        </q-tabs>

        <q-separator class="q-mt-none" />

        <q-tab-panels v-model="activeTabs" class="mb-2">
          <q-tab-panel
            v-for="(tab, index) in tabs"
            :key="index"
            :name="tab.value"
            class="mb-2"
          >
            <Component :is="tab.component" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.q-tabs {
  .q-tab {
    text-transform: none;
  }
}
</style>
