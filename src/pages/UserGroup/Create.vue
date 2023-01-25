<template>
  <!-- Heading -->
  <div
    class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5 xl:mt-8"
  >
    <q-icon name="keyboard_backspace" class="text-gray-400" />
    <RouterLink :to="{ name: 'customergroups' }" class="text-gray-400"
      >Customer Groups</RouterLink
    >
    <span>/</span>
    <span>Add Customer Groups</span>
  </div>
  <!-- Form -->
  <Form />
</template>
<script setup>
import Form from "src/components/UserGroup/Form.vue";
</script>
