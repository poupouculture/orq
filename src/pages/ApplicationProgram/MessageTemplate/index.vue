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
      Message Templates
    </p>
    <div class="row justify-between">
      <div class="flex items-center gap-x-3">
        <SearchTableInput
        :loading="loading"
        @search="searchHandler"
        @reset="resetSearch"
      />
        <q-select
            dense
            outlined
            v-model="status"
            option-value="value"
            option-label="label"
            :options="statusOptions"
            map-options
            emit-value
            label="Status"
          />
      </div>
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
import { Notify } from "quasar";
import {
  getMessageTemplates,
  updateMessageTemplate,
} from "src/api/messageTemplate";
import { ref, reactive, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import TableComponent from "src/components/ApplicationProgram/TableComponent.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";

const router = useRouter();

const loading = ref(true);
const search = ref("");
const selected = ref([]);
const status = ref("All Status");
const statusOptions = [
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Published",
    value: "published",
  },
];
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
    search: search.value,
    status: status.value == "All Status" ? "*" : status.value
  });
  data.applicationPrograms = applicationPrograms;
  data.totalCount = meta?.filter_count;
  loading.value = false;
};
watch(async() => {
  data.page = 1;
  await fetchApplicationPrograms();
});

const changePage = (val) => {
  data.page = val;
  fetchApplicationPrograms();
};
const archiveSelected = () => {
  if (selected.value.length > 0) {
    selected.value.forEach(async (data) => {
      data.status = "archived";
      await updateMessageTemplate(data.id, data);
    });
    Notify.create({
      message: `Selected Template has been archived`,
      position: "top",
      type: "positive",
      color: "blue-9",
    });
  } else {
    Notify.create({
      message: `Warning: Message template not selected`,
      position: "top",
      type: "warning",
      color: "red-1",
    });
  }

  selected.value = [];
};

const searchHandler = (searchValue = "") => {
  search.value = searchValue;
  loading.value = true;
  fetchApplicationPrograms();
};

const resetSearch = () => {
  search.value = "";
  searchHandler();
};
</script>
<style scoped src="../style.scss" />
