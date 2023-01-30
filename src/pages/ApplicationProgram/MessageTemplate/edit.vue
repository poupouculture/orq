<template>
  <BaseLayout
    :applicationProgram="applicationProgram"
    @submitGeneralInformation="submit"
    v-if="!loading"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseLayout from "src/components/ApplicationProgram/BaseLayout.vue";
import {
  getMessageTemplate,
  updateMessageTemplate,
} from "src/api/messageTemplate";

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const applicationProgram = ref(null);

onMounted(async () => {
  const id = route.params.id;
  applicationProgram.value = await getMessageTemplate(id);
  loading.value = false;
});

const submit = async (payload) => {
  await updateMessageTemplate(route.params.id, payload);
  router.push("/application-programs/message-templates");
};
</script>

<style scoped src="./style.scss" />
