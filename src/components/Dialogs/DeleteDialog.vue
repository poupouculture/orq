<template>
  <BaseDialog
    :modelValue="props.modelValue"
    title="Delete"
    :description="description"
    submit-label="Delete"
    @submit="submitDelete"
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
const emit = defineEmits(["submitDelete"]);

const description = ref(
  "This action is permanent and can not be undone. Are you sure you would like to proceed?"
);

const submitDelete = () => {
  emit("submitDelete");
};
</script>
