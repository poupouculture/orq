<template>
  <BaseDialog
    :modelValue="props.modelValue"
    title="Unsave Changes"
    :description="description"
    cancel-label="Discard Changes"
    submit-label="Keep Editing"
    @submit="cancel"
    @cancel="submit"
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
const emit = defineEmits(["submit", "cancel"]);

const description = ref("Are you sure want to leave this page?");

const submit = () => {
  emit("submit");
};
const cancel = () => {
  emit("cancel");
};
</script>
