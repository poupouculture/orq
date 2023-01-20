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
<<<<<<< HEAD
  <DeleteDialog
    v-model="deleteDialog"
    @cancel="deleteDialog = false"
    @submitDelete="submitDelete"
  />
=======
  <DeleteDialog v-model="deleteDialog" @cancel="deleteDialog = false" @submitDelete="submitDelete" />
>>>>>>> bea3a9219f75b957af42e365111f7a7f231903f3
</template>
<script setup>
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import { ref } from "vue";

const deleteDialog = ref(false);
const submitDelete = () => {
<<<<<<< HEAD
  console.log("asdf");
};
=======
  console.log('asdf')
}
>>>>>>> bea3a9219f75b957af42e365111f7a7f231903f3
</script>
