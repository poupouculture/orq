<template>
  <BaseLayout
    :applicationProgram="applicationProgram"
    @submitGeneralInformation="submit"
    formType="bots"
    v-if="!loading"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseLayout from "src/components/ApplicationProgram/BaseLayout.vue";
import { getBotTemplate, updateBotTemplate } from "src/api/botTemplate";

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const applicationProgram = ref(null);

onMounted(async () => {
  const id = route.params.id;
  applicationProgram.value = await getBotTemplate(id);
  loading.value = false;
});

const submit = async (payload) => {
  await updateBotTemplate(route.params.id, payload);
  router.push("/application-programs/chatbots");
};
</script>

<style scoped src="../style.scss" />
