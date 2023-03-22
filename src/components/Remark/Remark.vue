<template>
  <div class="lg:w-10/12 mx-auto">
    <p class="mb-3">Description</p>
    <q-editor
      v-focus
      v-model="remark"
      min-height="16rem"
      placeholder="Write your description ...."
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
interface Props {
  modelValue: string;
}
interface Emit {
  (e: "update:modelValue", value: string): void;
}

// Focust Directive
const vFocus = {
  mounted: (el: any) => el.focus(),
};

const props = defineProps<Props>();

const emits = defineEmits<Emit>();

const remark = computed({
  set: (value) => emits("update:modelValue", value),
  get: () => props.modelValue,
});
</script>
