<template>
  <BaseLayout @submitGeneralInformation="submit" formType="bots" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BaseLayout from "src/components/ApplicationProgram/BaseLayout.vue";
import { addBotTemplate } from "src/api/botTemplate.js";
import { Loading, Notify } from "quasar";

const router = useRouter();
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});

const submit = async (payload) => {
  Loading.show();
  await addBotTemplate(payload);
  Notify.create({
    message: "Bot Template has been saved",
    color: "primary",
    type: "positive",
    position: "top",
  });
  Loading.hide();
  router.push("/application-programs/chatbots");
};
</script>

<style scoped src="../style.scss" />
