<template>
  <BaseLayout v-if="!loading" @submitGeneralInformation="submit" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import BaseLayout from "src/components/Customer/BaseLayout.vue";
import { useRouter } from "vue-router";
import useCustomerStore from "src/stores/modules/customer";
import { useQuasar } from "quasar";

const router = useRouter();
const $q = useQuasar();
const customerStore = useCustomerStore();
const loading = ref(true);

onMounted(() => {
  customerStore.$reset();
  loading.value = false;
});

const submit = async (payload) => {
  try {
    const data = await customerStore.addCustomer(payload);

    $q.notify({
      type: "positive",
      message: "a new customer has been added.",
    });
    router.push(`/customers/${data.id}`);
  } catch (error) {
    $q.notify({
      type: "warning",
      message:
        "There seems to be an error getting the server response, please try again",
    });
  }
};
</script>
