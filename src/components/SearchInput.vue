<script setup lang="ts">
import { ref } from "vue";

interface Props {
  search: string;
}

interface Emit {
  (e: "update:input", value: string): void;
}

const props = defineProps<Props>();
defineEmits<Emit>();

const value = ref(props.search);
</script>

<template>
  <q-input
    placeholder="Search"
    bg-color="dark"
    outlined
    dense
    v-model="value"
    @update:model-value="$emit('update:input', value)"
    class="search-field"
  >
    <template v-slot:prepend>
      <q-icon name="search" color="teal-1" />
    </template>
  </q-input>
</template>

<style scoped>
:deep(.q-field__native),
.q-field__prefix,
.q-field__suffix,
.q-field__input {
  color: #fff;
}
</style>
