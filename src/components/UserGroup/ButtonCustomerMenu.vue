<template>
  <q-btn color="grey-7" round flat icon="more_vert">
    <q-menu fit anchor="bottom middle" self="top right" auto-close>
      <q-list>
        <q-item clickable @click="openCustomerDetail()">
          <q-item-section>View</q-item-section>
        </q-item>
        <q-item clickable @click="deleteDialog = true">
          <q-item-section>Remove</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
  <DeleteDialog
    v-model="deleteDialog"
    @cancel="deleteDialog = false"
    @submit-delete="deleteCustomer"
  />
  <!-- Modal / Dialog Customer detail -->
  <q-dialog v-model="showCustomerDetail">
    <div
      class="h-full bg-white w-auto !rounded-2xl px-7 py-4 overflow-y-auto relative"
    >
      <div class="cursor-pointer absolute top-6 right-7">
        <svg
          @click="showCustomerDetail = false"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 13L13 1M1 1L13 13"
            stroke="#9CA3AF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <!-- Content -->
      <BaseLayout mode="show" />
    </div>
  </q-dialog>
</template>
<script setup>
import { Loading } from "quasar";
import useCustomerStore from "src/stores/modules/customer";
import useCustomerGroupStore from "src/stores/modules/customerGroup";
import { ref } from "vue";
import BaseLayout from "../Customer/BaseLayout.vue";
import DeleteDialog from "../Dialogs/DeleteDialog.vue";

const customerGroupStore = useCustomerGroupStore();
const customerStore = useCustomerStore();
const showCustomerDetail = ref(false);
const props = defineProps({
  id: [String, Number],
  customerId: [String, Number],
});
const deleteDialog = ref(false);
const openCustomerDetail = async () => {
  Loading.show();
  await customerStore.fetchCustomer(props.customerId);
  Loading.hide();
  showCustomerDetail.value = true;
};
const deleteCustomer = () => {
  customerGroupStore.deleteCustomer(props.id, props.customerId);
};
</script>
<style lang="scss" scoped>
.date {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    bottom: 0;
    height: 1px;
    background-color: #e6e6ec;
    @apply left-0 lg:left-4 w-[30%] md:w-[38%];
  }
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    bottom: 0;
    height: 1px;
    background-color: #e6e6ec;
    @apply right-0 lg:right-4 w-[30%] md:w-[38%];
  }
}
.q-dialog__inner--minimized > div {
  max-width: 100vw;
}
</style>
