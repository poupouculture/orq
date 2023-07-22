<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  value: {
    type: String,
    default: () => "",
  },
  rules: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: () => "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(props.value);

watch(internalValue, (newValue) => {
  emit("update:modelValue", newValue);
});

const rejectionReasons = ref([]);

const validate = async () => {
  const validationResults = await Promise.allSettled(
    props.rules.map(async (rule) => await rule(internalValue.value))
  );

  const reasons = validationResults
    .filter((result) => result.status === "rejected" || result.value !== true)
    .map((result) => result.reason ?? result.value);

  if (reasons.length > 0) {
    rejectionReasons.value = reasons;
    return false;
  }

  return true;
};

const resetRejectionReasons = () => {
  rejectionReasons.value = [];
};

defineExpose({ validate });
</script>

<template>
  <input
    type="text"
    class="w-full h-8 px-4 py-1 mt-2 rounded-md border-2 border-primary"
    v-model="internalValue"
    :placeholder="placeholder"
    @input="resetRejectionReasons"
  />
  <div v-if="rejectionReasons.length > 0" class="text-red-500">
    <ul v-if="rejectionReasons.length > 1">
      <li v-for="reason in rejectionReasons" :key="reason">{{ reason }}</li>
    </ul>
    <div v-else>{{ rejectionReasons[0] }}</div>
  </div>
</template>
