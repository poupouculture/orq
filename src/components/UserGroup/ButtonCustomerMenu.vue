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
      <div class="w-full flex justify-end">
        <q-btn
          flat
          @click="showCustomerDetail = !showCustomerDetail"
          round
          color="primary"
          icon="close"
        />
      </div>

      <BaseLayout
        mode="edit"
        @discard="showCustomerDetail = !showCustomerDetail"
        @submit-general-information="saveCustomerInformation"
      />
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

defineEmits(["discard"]);

const props = defineProps({
  id: [String, Number],
  customerId: [String, Number],
  pagination: Object,
});
const deleteDialog = ref(false);
const openCustomerDetail = async () => {
  Loading.show();
  await customerStore.fetchCustomer(props.customerId);
  Loading.hide();
  showCustomerDetail.value = true;
};
const deleteCustomer = async () => {
  await customerGroupStore.deleteCustomer(props.id, props.customerId);
  await customerGroupStore.getAll({
    rowsPerPage: props.pagination.rowsPerPage,
    page: props.pagination.page,
  });
};
const saveCustomerInformation = async (payload) => {
  await customerStore.updateCustomer(props.customerId, payload);
  showCustomerDetail.value = false;
  Loading.show();
  await customerGroupStore.getAll({
    rowsPerPage: props.pagination.rowsPerPage,
    page: props.pagination.page,
  });
  Loading.hide();
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
