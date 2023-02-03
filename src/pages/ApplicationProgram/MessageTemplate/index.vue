<template>
  <div class="main-container">
    <p class="header-text">
      <span class="text-gray-400">
        <q-icon name="fa-solid fa-arrow-left" />
        Application program /
      </span>
      Message Templates
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
          @click="router.push('/application-programs/message-templates/create')"
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
    <div class="main-content">
      <TableComponent
        :applicationPrograms="data.applicationPrograms"
        :totalCount="data.totalCount"
        :page="data.page"
        :rowsPerPage="data.rowsPerPage"
        v-model:selected="selected"
        @changePage="changePage"
        v-if="!loading"
      />
    </div>
  </div>
</template>

<script setup>
import {
  getMessageTemplates,
  updateMessageTemplate,
} from "src/api/messageTemplate";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import TableComponent from "src/components/ApplicationProgram/TableComponent.vue";

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
  } = await getMessageTemplates({
    limit: data.rowsPerPage,
    page: data.page,
  });
  data.applicationPrograms = applicationPrograms;
  data.totalCount = meta?.total_count;
  loading.value = false;
};
// const changePage = (val) => {
//   data.page = val;
//   fetchApplicationPrograms();
// };
const archiveSelected = () => {
  selected.value.forEach(async (data) => {
    data.status = "archive";
    await updateMessageTemplate(data.id, data);
  });
};
</script>
<style scoped src="./style.scss" />
