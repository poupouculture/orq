<template>
  <q-btn color="grey-7" round flat icon="more_vert">
    <q-menu fit anchor="bottom middle" self="top right" auto-close>
      <q-list>
        <q-item clickable>
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
</template>
<script setup>
import useCustomerGroupStore from "src/stores/modules/customerGroup";
import { ref } from "vue";
import DeleteDialog from "../Dialogs/DeleteDialog.vue";

const customerGroupStore = useCustomerGroupStore();
const props = defineProps({
  id: [String, Number],
  customerId: [String, Number],
});
const deleteDialog = ref(false);
const deleteCustomer = () => {
  customerGroupStore.deleteCustomer(props.id, props.customerId);
};
</script>
