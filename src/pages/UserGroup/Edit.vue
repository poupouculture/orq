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
  <Form v-if="customerGroup" :id="route.params.id" />
</template>
<script setup>
import Form from "src/components/UserGroup/Form.vue";
import useCustomerGroupStore from "src/stores/modules/customerGroup";
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const customerGroupStore = useCustomerGroupStore();
const customerGroup = computed(() => customerGroupStore.item);
const route = useRoute();
// watch(route, (val) => {
//   console.log(val);
//   customerGroupStore.get(val.params.value.id);
// });
onMounted(async () => {
  await customerGroupStore.get(route.params.id);
});
</script>
