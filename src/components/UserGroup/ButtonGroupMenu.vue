<template>
  <div class="flex items-center">
    <q-btn color="grey-7" round flat icon="more_vert">
      <q-menu fit anchor="bottom middle" self="top right" auto-close>
        <q-list>
          <q-item clickable>
            <q-item-section>Edit</q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section>Add Customers</q-item-section>
          </q-item>
          <q-item clickable @click="deleteDialog = true">
            <q-item-section>Delete Group</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
  <DeleteDialog
    v-model="deleteDialog"
    @cancel="deleteDialog = false"
    @submitDelete="submitDelete"
  />
</template>
<script setup>
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import { ref } from "vue";

const deleteDialog = ref(false);
const submitDelete = () => {
  console.log("asdf");
};
</script>
