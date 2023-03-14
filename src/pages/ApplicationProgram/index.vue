<template>
  <div class="main-container">
    <p class="header-text">
      <span class="text-gray-400"> Application program </span>
    </p>
    <div class="main-content flex">
      <div class="w-5/12 lg:w-3/12 pr-4">
        <SubmenuFilter
          :menus="subfilters"
          v-if="!loading"
          @changeChildMenu="setChildMenu"
          @setActiveMenu="setActiveMenu"
        />
      </div>
      <div class="w-7/12 lg:w-9/12 grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div
          class="w-full flex flex-col bg-white rounded-lg hover:cursor-pointer"
          v-for="(menu, index) of childMenus"
          :key="index"
          @click="router.push('/application-programs' + menu.url)"
        >
          <div
            class="w-full flex py-10 rounded-t-lg justify-center bg-indigo-200"
          >
            <div
              class="w-16 h-16 bg-white rounded-full flex justify-center items-center"
            >
              <q-icon
                :name="menu?.icon ? menu.icon : 'fa-solid fa-users'"
                class="text-2xl text-purple-600"
              />
            </div>
          </div>
          <div class="w-full p-2">
            <h2 class="font-semibold">
              {{ menu.name }}
            </h2>
            <p class="text-gray-400">{{ menu.description }}</p>
            <div class="text-gray-400 mt-2 flex gap-2 items-center">
              <q-icon name="fa-solid fa-lock" />
              {{ menu.extra_description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getMessageTemplates } from "src/api/messageTemplate";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import useUserInfoStore from "../../stores/modules/userInfo";
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
const childMenus = ref([]);

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

const setChildMenu = (value) => {
  childMenus.value = value;
};

const setActiveMenu = (value) => {
  console.log("active", value);
};
</script>
<style scoped src="./style.scss" />
