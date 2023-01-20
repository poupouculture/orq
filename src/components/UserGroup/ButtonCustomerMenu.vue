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
    @submitDelete="submitDelete"
  />
</template>
<script setup>
import { ref } from "vue";
import DeleteDialog from "../Dialogs/DeleteDialog.vue";

const deleteDialog = ref(false);
const submitDelete = () => {
  console.log("asdf");
};
</script>
