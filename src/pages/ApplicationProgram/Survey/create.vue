<template>
  <BaseLayout @submitGeneralInformation="submit" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BaseLayout from "src/components/ApplicationProgram/SurveyLayout.vue";
import { addCustomerServiceTemplate } from "src/api/customerService.js";
import { Loading, Notify } from "quasar";

const router = useRouter();
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});

const submit = async (payload) => {
  Loading.show();
  await addCustomerServiceTemplate(payload);
  Notify.create({
    message: "Customer Service Template has been saved",
    color: "primary",
    type: "positive",
    position: "top",
  });
  Loading.hide();
  router.push("/application-programs/surveys");
};
</script>

<style scoped src="../style.scss" />
