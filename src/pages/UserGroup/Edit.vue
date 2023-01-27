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
    <span>Edit Customer Groups</span>
  </div>
  <!-- Form -->
  <Form v-if="!loading" :id="route.params.id" />
</template>
<script setup>
import { Loading } from "quasar";
import Form from "src/components/UserGroup/Form.vue";
import useCustomerGroupStore from "src/stores/modules/customerGroup";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const customerGroupStore = useCustomerGroupStore();
const loading = ref(false);
const route = useRoute();

onMounted(async () => {
  Loading.show();
  loading.value = true;
  await customerGroupStore.get(route.params.id);
  loading.value = false;
  Loading.hide();
});
</script>
