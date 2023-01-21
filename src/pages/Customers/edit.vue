<template>
  <BaseLayout v-if="!loading" @submitGeneralInformation="submit" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import BaseLayout from "src/components/Customer/BaseLayout.vue";
import { useRouter, useRoute } from "vue-router";
import useCustomerStore from "src/stores/modules/customer";

const router = useRouter();
const route = useRoute();
const customerStore = useCustomerStore();
const loading = ref(true);

onMounted(async () => {
  const id = route.params.id;
  await customerStore.fetchCustomer(id);
  loading.value = false;
});

const submit = async (payload) => {
  const id = route.params.id;
  await customerStore.updateCustomer(id, payload);
  router.push("/customers");
};
</script>
