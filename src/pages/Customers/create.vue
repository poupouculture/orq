<template>
  <BaseLayout v-if="!loading" @submitGeneralInformation="submit" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import BaseLayout from "src/components/Customer/BaseLayout.vue";
import { useRouter } from "vue-router";
import useCustomerStore from "src/stores/modules/customer";

const router = useRouter();
const customerStore = useCustomerStore();
const loading = ref(true);

onMounted(() => {
  customerStore.resetCustomer();
  loading.value = false;
});

const submit = async (payload) => {
  await customerStore.addCustomer(payload);
  router.push("/customers");
};
</script>
