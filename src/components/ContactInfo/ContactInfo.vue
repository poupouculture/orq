<script setup lang="ts">
import { ref } from "vue";
import useContactStore from "src/stores/modules/contact";
import { storeToRefs } from "pinia";

// State
const editMode = ref(false);
const categoryOptions = ref(["phone"]);
const statusOptions = ref(["Active"]);

const contacts = useContactStore();
const { getContacts } = storeToRefs(contacts);

console.log(getContacts.value);
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-end">
      <q-btn
        @click="editMode = !editMode"
        :color="editMode ? 'red-6' : 'primary'"
        :outline="editMode"
        class=""
        :label="editMode ? 'cancel' : 'edit'"
      />
    </div>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div class="flex flex-col">
        <p class="label-style">Category</p>
        <q-select
          outlined
          :disable="!editMode"
          dense
          lazy-rules
          :options="categoryOptions"
        />
      </div>

      <div class="flex flex-col">
        <p class="label-style">Extension</p>
        <q-input outlined :disable="!editMode" dense />
      </div>

      <div class="flex flex-col">
        <p class="label-style">First Name</p>
        <q-input outlined :disable="!editMode" dense />
      </div>

      <div class="flex flex-col">
        <p class="label-style">Last Name</p>
        <q-input outlined :disable="!editMode" dense />
      </div>

      <div class="flex flex-col">
        <p class="label-style">Number</p>
        <q-input outlined :disable="!editMode" dense />
        <q-checkbox
          :disable="!editMode"
          :true-value="true"
          :false-value="false"
          label="Contact is Active"
        />
      </div>

      <div class="flex flex-col">
        <p class="label-style">Remarks</p>
        <q-input outlined :disable="!editMode" dense />
      </div>

      <div class="flex flex-col">
        <p class="label-style">Status</p>
        <q-select
          :options="statusOptions"
          dense
          outlined
          :disable="!editMode"
        />
      </div>
    </div>

    <div v-if="editMode" class="flex justify-end">
      <q-btn color="primary" label="Save" />
    </div>
  </div>
</template>

<style scoped>
.label-style {
  font-family: "Archivo";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;

  color: #2e2e3a;
  margin-bottom: 10px;
}
</style>
