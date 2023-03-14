<template>
  <div class="lg:w-10/12 mx-auto">
    <p class="mb-3">Description</p>
    <q-editor
      v-model="remark"
      min-height="16rem"
      placeholder="Write your description ...."
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
});
const emits = defineEmits(["update:modelValue"]);

const remark = computed({
  set: (value) => emits("update:modelValue", value),
  get: () => props.modelValue,
});
</script>
