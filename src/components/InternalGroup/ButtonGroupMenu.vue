<template>
  <div class="flex items-center">
    <q-btn color="grey-7" round flat icon="more_vert">
      <q-menu fit anchor="bottom middle" self="top right" auto-close>
        <q-list>
          <q-item
            v-if="group.type === 'personal'"
            clickable
            :to="{
              name: 'internal-group.edit',
              params: { id },
            }"
          >
            <q-item-section>Edit</q-item-section>
          </q-item>
          <q-item clickable @click="toggleAddUser()">
            <q-item-section>Add Users</q-item-section>
          </q-item>
          <q-item clickable @click="deleteDialog = true">
            <q-item-section>Delete Group</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <DeleteDialog
      v-model="deleteDialog"
      @cancel="deleteDialog = false"
      @submit-delete="submitDelete"
    />
    <AddUserOverlay
      v-if="openAddUser"
      @submit="(val) => submitAddUser(val)"
      @close="openAddUser = false"
      :data="usersData"
      @changePage="changePage"
      @search="searchHandler"
      :pagination="pagination"
    />
  </div>
</template>
<script setup>
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import { ref, reactive, computed } from "vue";
import { getUsersFilter } from "src/api/InternalGroup";
import useInternalGroupStore from "src/stores/modules/internalGroup";
import { Loading } from "quasar";
import AddUserOverlay from "./AddUser.vue";

const emits = defineEmits(["addUser", "deleteGroup"]);
const props = defineProps({
  id: [String, Number],
  group: Object,
});
const deleteDialog = ref(false);
const openAddUser = ref(false);
const usersData = ref([]);
const internalGroupStore = useInternalGroupStore();
const item = computed(() =>
  internalGroupStore.items.find((item) => item.id === props.id)
);
const userQuery = ref("");

const toggleAddUser = async () => {
  if (!openAddUser.value) {
    userQuery.value = null;
    pagination.page = 1;
    await fetchUsers();
  }
  openAddUser.value = !openAddUser.value;
};
const searchHandler = async (value) => {
  try {
    userQuery.value = value;
    pagination.page = 1;
    await fetchUsers();
  } catch (error) {}
};
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  totalCount: 0,
  filterCount: 0,
});
const fetchUsers = async () => {
  Loading.show();
  const {
    data: { data: users, meta },
  } = await getUsersFilter(
    {
      limit: pagination.rowsPerPage,
      page: pagination.page,
      search: userQuery.value?.length ? userQuery.value : undefined,
    },
    item.value.users.map((user) => user.directus_users_id.id)
  );
  Loading.hide();
  usersData.value = users;
  pagination.totalCount = meta?.filter_count;
  Loading.hide();
};

const submitAddUser = async (val) => {
  toggleAddUser();
  if (val && val.length) {
    await internalGroupStore.addUsers({
      id: props.id,
      users: val.map((item) => item.id),
    });
    emits("addUser");
  }
};

const submitDelete = async () => {
  await internalGroupStore.delete(props.id);
  emits("deleteGroup");
};
const changePage = (val) => {
  pagination.page = val;
  fetchUsers();
};
</script>
