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
      <span>Edit Customer Groups</span>
    </div>
    <!-- Form -->
    <Form v-if="!loading" :id="route.params.id" />
    <ReturnDialog
      v-model="returnDialog"
      @cancel="returnDialog = false"
      @keepEditing="returnDialog = false"
      @submit="dialogSubmit()"
    />
  </div>
</template>
<script setup>
import { Loading } from "quasar";
import ReturnDialog from "src/components/Dialogs/ReturnDialog.vue";
import Form from "src/components/UserGroup/Form.vue";
import useCustomerGroupStore from "src/stores/modules/customerGroup";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const customerGroupStore = useCustomerGroupStore();
const loading = ref(false);
const route = useRoute();
const router = useRouter();

const dialogSubmit = async () => {
  router.push({ name: "customergroups" });
};
const returnDialog = ref(false);
onMounted(async () => {
  Loading.show();
  loading.value = true;
  await customerGroupStore.get(route.params.id);
  loading.value = false;
  Loading.hide();
});
</script>
