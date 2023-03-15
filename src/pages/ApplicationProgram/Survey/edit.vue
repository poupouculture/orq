<template>
  <BaseLayout
    :applicationProgram="applicationProgram"
    @submitGeneralInformation="submit"
    formType="customer-service"
    v-if="!loading"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseLayout from "src/components/ApplicationProgram/BaseLayout.vue";
import {
  getCustomerServiceTemplate,
  updateCustomerServiceTemplate,
} from "src/api/customerService";

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const applicationProgram = ref(null);

onMounted(async () => {
  const id = route.params.id;
  applicationProgram.value = await getCustomerServiceTemplate(id);
  loading.value = false;
});

const submit = async (payload) => {
  await updateCustomerServiceTemplate(route.params.id, payload);
  router.push("/application-programs/customer-services");
};
</script>

<style scoped src="../style.scss" />
