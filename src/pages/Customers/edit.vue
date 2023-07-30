<template>
  <BaseLayout
    v-if="!loading"
    @discard="$router.go(-1)"
    @submitGeneralInformation="submit"
    @deleteGeneralInformation="deleteUser"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import BaseLayout from "src/components/Customer/BaseLayout.vue";
import { useRouter, useRoute } from "vue-router";
import useCustomerStore from "src/stores/modules/customer";
import useContactStore from "src/stores/modules/contact";
import useMessagingStore from "src/stores/modules/messaging";

const router = useRouter();
const route = useRoute();
const customerStore = useCustomerStore();
const contactStore = useContactStore();
const messagingStore = useMessagingStore();
const loading = ref(true);

onMounted(async () => {
  contactStore.$reset();
  messagingStore.$reset();
  const id = route.params.id;
  await customerStore.fetchCustomer(id);
  loading.value = false;
});

const deleteUser = async () => {
  const id = route.params.id;
  await customerStore.deleteCustomer([id]);
  router.push("/customers");
};

const submit = async (payload) => {
  const id = route.params.id;
  await customerStore.updateCustomer(id, payload);
  router.push("/customers");
};
</script>
