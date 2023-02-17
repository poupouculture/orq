<template>
  <BaseLayout @submitGeneralInformation="submit" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BaseLayout from "src/components/ApplicationProgram/BaseLayout.vue";
import { addMessageTemplate } from "src/api/messageTemplate.js";
import { Loading, Notify } from "quasar";

const router = useRouter();
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});

const submit = async (payload) => {
  Loading.show();
  await addMessageTemplate(payload);
  Notify.create({
    message: "Message Template has been saved",
    color: "primary",
    type: "positive",
    position: "top",
  });
  Loading.hide();
  router.push("/application-programs/message-templates");
};
</script>

<style scoped src="./style.scss" />
