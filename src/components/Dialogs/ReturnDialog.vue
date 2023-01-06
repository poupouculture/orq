<template>
  <BaseDialog
    :modelValue="props.modelValue"
    title="Unsave Changes"
    :description="description"
    submit-label="Keep Editing"
    cancel-label="Discard Changes"
    @submit="keepEditing"
  />
</template>

<script setup>
import BaseDialog from "./BaseDialog.vue";
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["keepEditing"]);

const description = ref("Are you sure want to leave this page?");

const keepEditing = () => {
  emit("keepEditing");
};
</script>
