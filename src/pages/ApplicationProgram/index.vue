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
          @click="router.push('/application-programs/create')"
        />
        <q-btn icon="delete" no-caps rounded label="Archive" />
      </div>
    </div>
    <div class="main-content flex">
      <div class="w-3/12 pr-4">
        <SubmenuFilter :menus="subfilters" v-if="!loading" />
      </div>
      <div class="w-9/12">
        <TableComponent
          :applicationPrograms="data.applicationPrograms"
          :totalCount="data.totalCount"
          :page="data.page"
          :rowsPerPage="data.rowsPerPage"
          @changePage="changePage"
          v-if="!loading"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getMessageTemplates } from "src/api/messageTemplate";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import useUserInfoStore from "../../stores/modules/userInfo";
// import { pageCodes } from "../../utils/page-codes";
import TableComponent from "src/components/ApplicationProgram/TableComponent.vue";
import SubmenuFilter from "src/components/ApplicationProgram/SubmenuFilter.vue";

const router = useRouter();
const userInfo = useUserInfoStore();

const loading = ref(true);
const data = reactive({
  applicationPrograms: [],
  totalCount: 0,
  page: 1,
  rowsPerPage: 10,
});
const subfilters = ref([]);

onMounted(() => {
  fetchApplicationPrograms();
  const menu = userInfo.userProfile.role.pages.find(
    (m) => m?.pages_id?.id === "F07"
  );
  subfilters.value = menu.pages_id.children;
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
const changePage = (val) => {
  data.page = val;
  fetchApplicationPrograms();
};
</script>
<style scoped src="./style.scss" />
