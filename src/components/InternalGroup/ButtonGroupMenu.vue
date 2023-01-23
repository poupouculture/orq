<template>
  <div class="flex items-center">
    <q-btn color="grey-7" round flat icon="more_vert">
      <q-menu fit anchor="bottom middle" self="top right" auto-close>
        <q-list>
          <q-item
            clickable
            :to="{
              name: 'customergroups-internal-group.edit',
              params: { id },
            }"
          >
            <q-item-section>Edit</q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section>Add Users</q-item-section>
          </q-item>
          <q-item clickable @click="deleteDialog = true">
            <q-item-section>Delete Group</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <DeleteDialog
      v-model="deleteDialog"
      @cancel="deleteDialog = false"
      @submit-delete="submitDelete"
    />
  </div>
</template>
<script setup>
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import { ref } from "vue";
import useInternalGroupStore from "src/stores/modules/internalGroup";

const props = defineProps({
  id: [String, Number],
});
const deleteDialog = ref(false);
const internalGroupStore = useInternalGroupStore();

const submitDelete = async () => {
  await internalGroupStore.delete(props.id);
};
</script>
