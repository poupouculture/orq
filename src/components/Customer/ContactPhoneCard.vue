<template>
  <div class="col-4 phone-card">
    <q-card class="my-card" flat bordered>
      <q-item>
        <q-item-section>
          <q-item-label>{{ props.phoneNumber }}</q-item-label>
          <q-item-label caption> {{ props.remarks }} </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section horizontal>
        <q-card-section>
          <q-btn
            flat
            size="sm"
            align="around"
            class="btn-fixed-width"
            color="black"
            label="View"
            icon="visibility"
            @click="view"
          />
        </q-card-section>

        <q-separator vertical />

        <q-card-section>
          <q-btn
            flat
            size="sm"
            align="around"
            class="btn-fixed-width"
            color="black"
            label="Edit"
            icon="drive_file_rename_outline"
            @click="edit"
          />
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
const emit = defineEmits(["edit", "view"]);
const props = defineProps(["phoneNumber", "remarks"]);

const edit = () => {
  emit("edit");
};

const view = () => {
  emit("view");
};
</script>

<style lang="sass" scoped>
.q-card--bordered
  border: none
</style>
