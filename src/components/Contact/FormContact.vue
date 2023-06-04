<template>
  <div class="flex flex-col bg-white p-6">
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div class="flex flex-col">
        <p class="label-style">First Name</p>
        <q-input outlined v-model="form.first_name" dense />
      </div>
      <div class="flex flex-col">
        <p class="label-style">Last Name</p>
        <q-input outlined v-model="form.last_name" dense />
      </div>
      <div class="flex flex-col">
        <p class="label-style">Number</p>
        <q-input disable outlined v-model="form.number" dense />
        <q-checkbox
          :true-value="true"
          v-model="form.is_active"
          :false-value="false"
          label="Contact is Active"
        />
      </div>
      <div class="flex flex-col">
        <p class="label-style">Category</p>
        <q-select
          outlined
          dense
          v-model="form.category"
          lazy-rules
          :options="categoryOptions"
        />
      </div>
    </div>
    <div class="flex items-center gap-x-3 mt-5 justify-end">
      <q-btn @click="emits('close')" color="secondary" outline label="Cancel" />
      <q-btn @click="emits('save', form)" color="primary" label="Save" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";

const emits = defineEmits(["close", "save"]);
const props = defineProps(["form"]);
const form = reactive({
  first_name: props.form?.first_name || "",
  last_name: props.form?.last_name || "",
  number: props.form?.number || "",
  is_active: props.form?.is_active || true,
  category: props.form?.category || "",
});
const categoryOptions = ["phone"];
</script>
