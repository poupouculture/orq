<template>
  <div>
    <!-- Heading -->
    <div
      class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5 xl:mt-8"
    >
      <q-icon
        name="keyboard_backspace"
        @click="returnDialog = true"
        class="text-gray-400 cursor-pointer"
      />
      <div @click="returnDialog = true" class="text-gray-400 cursor-pointer">
        Customer Groups
      </div>
      <span>/</span>
      <span>Add Customer Groups</span>
    </div>
    <!-- Form -->
    <Form />
    <ReturnDialog
      v-model="returnDialog"
      @cancel="returnDialog = false"
      @keepEditing="returnDialog = false"
      @submit="dialogSubmit()"
    />
  </div>
</template>
<script setup>
import Form from "src/components/UserGroup/Form.vue";
import ReturnDialog from "src/components/Dialogs/ReturnDialog.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const dialogSubmit = async () => {
  router.push({ name: "customergroups" });
};
const returnDialog = ref(false);
</script>
