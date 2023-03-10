<script setup lang="ts">
import CompanyInformation from "src/components/Order/Invoice/companyInformation.vue";
import CustomerInformation from "components/Order/Invoice/customerInformation.vue";
import InvoiceInformation from "components/Order/Invoice/invoiceInformation.vue";
import Preview from "components/Order/Invoice/Preview.vue";
import SendPdf from "components/Order/Invoice/SendPdf.vue";
import { computed, ref } from "vue";

const activeTabs = ref("companyInformation");

const rightSideComponent = ref("sendPdf");

const tabs = computed(() => {
  return [
    {
      label: "Company",
      component: CompanyInformation,
      value: "companyInformation",
    },
    {
      label: "Customer",
      component: CustomerInformation,
      value: "customerInformation",
    },
    {
      label: "Invoice",
      component: InvoiceInformation,
      value: "invoiceInformation",
    },
  ];
});

const switchComponent = (componentName: string) => {
  rightSideComponent.value = componentName;
};
</script>

<template>
  <div
    class="w-full flex flex-col lg:flex-row min-h-screen lg:h-full justify-between"
  >
    <div class="bg-white py-16 px-5 rounded-2xl w-full lg:w-1/2">
      <div class="w-full flex flex-col">
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
            no-caps
            indicator-color="primary"
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
              <KeepAlive>
                <Component :is="tab.component" />
              </KeepAlive>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>

    <div class="flex flex-col pl-10 py-16 w-full lg:w-1/2">
      <p class="font-semibold capitalize text-2xl tetx-[#111827]">preview</p>

      <div class="flex justify-center items-center w-full mt-6 gap-6">
        <div>
          <button
            @click="switchComponent('preview')"
            :class="[
              rightSideComponent == 'preview'
                ? 'bg-primary text-white'
                : 'border-dotted border-2 text-primary border-primary',
              'rounded-lg py-2 px-4',
            ]"
          >
            Invoice PDF
          </button>
        </div>

        <div>
          <button
            @click="switchComponent('sendPdf')"
            :class="[
              rightSideComponent == 'sendPdf'
                ? 'bg-primary text-white'
                : 'border-dotted border-2 text-primary border-primary',
              'rounded-lg py-2 px-4',
            ]"
          >
            Send Now
          </button>
        </div>
      </div>

      <div class="flex mb-6 w-full">
        <Preview v-if="rightSideComponent == 'preview'" />
        <SendPdf v-if="rightSideComponent == 'sendPdf'" />
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
