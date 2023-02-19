<template>
  <div>
    <p class="mb-2">{{ label }}</p>
    <q-select
      v-model="value"
      :options="options"
      use-input
      :rules="[(val) => required(val)]"
      :input-debounce="700"
      outlined
      lazy-rules
      multiple
      dense
      map-options
      @filter="filter"
      :disable="mode == 'show'"
      use-chips
    />
  </div>
</template>

<script setup lang="ts">
import { required } from "src/utils/validation-rules";
import { computed } from "vue";

const props = defineProps({
  mode: { default: "edit" },
  label: { type: String, default: "" },
  options: { type: Array, default: () => [] },
  modelValue: { type: Array, default: () => [] },
  filterUrl: { type: String, default: "" },
  optionVariableName: { type: String, default: "" },
  nameLabel: { type: String, default: "name" },
});
const emits = defineEmits([
  "update:modelValue",
  "filter",
  "update:multiOptions",
]);

const value = computed({
  set: (val) => emits("update:modelValue", val),
  get: () => props.modelValue,
});

const filter = async (val: string, update: any) => {
  if (val === "") {
    update(() => {
      emits("update:multiOptions", {
        data: props.options,
        filterUrl: props.filterUrl,
        variableName: props.optionVariableName,
        nameLabel: props.nameLabel,
      });
    });
  } else {
    update(() => {
      emits("update:multiOptions", {
        data: val,
        filterUrl: props.filterUrl,
        variableName: props.optionVariableName,
        nameLabel: props.nameLabel,
      });
    });
  }
};
</script>
