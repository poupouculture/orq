<template>
  <div class="lg:w-10/12 mx-auto">
    <div class="flex justify-end">
      <q-btn
        v-if="mode === 'show'"
        @click="mode = 'edit'"
        color="primary"
        label="Edit"
      />
      <q-btn
        v-if="mode === 'edit'"
        @click="mode = 'show'"
        color="red"
        outline
        label="Cancel"
      />
    </div>
    <p class="mb-3">Description</p>
    <q-editor
      v-focus
      v-model="remark"
      :disable="mode == 'show'"
      min-height="16rem"
      placeholder="Write your description ...."
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
interface Props {
  modelValue: string;
  mode?: string;
}
interface Emit {
  (e: "update:modelValue", value: string): void;
  (e: "update:mode", value: string): void;
}

// Focust Directive
const vFocus = {
  mounted: (el: any) => el.focus(),
};

const props = withDefaults(defineProps<Props>(), {
  mode: "show",
});

const mode = computed({
  set: (value) => emits("update:mode", value),
  get: () => props.mode,
});
const emits = defineEmits<Emit>();
const remark = computed({
  set: (value) => emits("update:modelValue", value),
  get: () => props.modelValue,
});
</script>
