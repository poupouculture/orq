<template>
  <div class="main-container">
    <p class="header-text">
      <router-link
        :to="`/application-programs/`"
        style="text-decoration: none; color: inherit"
      >
        <span class="text-gray-400">
          <q-icon name="fa-solid fa-arrow-left" />
          Application program /
        </span>
      </router-link>
      Survey
    </p>
    <div class="row justify-between">
      <q-input placeholder="Search" outlined dense>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <div>
        <q-btn
          icon="add"
          no-caps
          rounded
          color="primary"
          label="Add"
          class="q-mr-sm"
          @click="router.push('/application-programs/surveys/create')"
        />
        <q-btn
          icon="archive"
          no-caps
          rounded
          label="Archive"
          @click="archiveSelected"
        />
      </div>
    </div>
    <div class="main-content"></div>
  </div>
</template>

<script setup>
import {
  getCustomerServiceTemplates,
  updateCustomerServiceTemplate,
} from "src/api/customerService";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Notify } from "quasar";

const router = useRouter();

const loading = ref(true);
const selected = ref([]);
const data = reactive({
  applicationPrograms: [],
  totalCount: 0,
  page: 1,
  rowsPerPage: 10,
});

onMounted(() => {
  fetchApplicationPrograms();
});
const fetchApplicationPrograms = async () => {
  const {
    data: { data: applicationPrograms, meta },
  } = await getCustomerServiceTemplates({
    limit: data.rowsPerPage,
    page: data.page,
  });
  data.applicationPrograms = applicationPrograms;
  data.totalCount = meta?.total_count;
  loading.value = false;
};
const archiveSelected = () => {
  selected.value.forEach(async (data) => {
    data.status = "archived";
    await updateCustomerServiceTemplate(data.id, data);
  });

  Notify.create({
    message: `Selected Survey has been archived`,
    position: "top",
    type: "positive",
    color: "blue-9",
  });

  selected.value = [];
};
</script>
<style scoped src="../style.scss" />
