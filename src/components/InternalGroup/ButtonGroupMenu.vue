<template>
  <div class="flex items-center">
    <q-btn color="grey-7" round flat icon="more_vert">
      <q-menu fit anchor="bottom middle" self="top right" auto-close>
        <q-list>
          <q-item
            clickable
            :to="{
              name: 'customergroups-internal-group.edit',
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
      :pagination="pagination"
    />
  </div>
</template>
<script setup>
import DeleteDialog from "src/components/Dialogs/DeleteDialog.vue";
import { ref, reactive } from "vue";
import { getUsersFilter } from "src/api/InternalGroup";
import useInternalGroupStore from "src/stores/modules/internalGroup";
import { Loading } from "quasar";
import AddUserOverlay from "./AddUserOverlay.vue";

const props = defineProps({
  id: [String, Number],
});
const deleteDialog = ref(false);
const openAddUser = ref(false);
const usersData = ref([]);
const internalGroupStore = useInternalGroupStore();

const toggleAddUser = async () => {
  if (!openAddUser.value) {
    await fetchUsers();
  }
  openAddUser.value = !openAddUser.value;
};
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  totalCount: 0,
});
const fetchUsers = async () => {
  Loading.show();
  const {
    data: { data: customers, meta },
  } = await getUsersFilter(
    {
      limit: pagination.rowsPerPage,
      page: pagination.page,
    },
    props.id
  );
  Loading.hide();
  usersData.value = customers;
  pagination.totalCount = meta?.total_count;
};

const submitAddUser = async (val) => {
  toggleAddUser();
  if (val && val.length) {
    internalGroupStore.addUsers({
      id: props.id,
      users: val,
    });
  }
};

const submitDelete = async () => {
  await internalGroupStore.delete(props.id);
};
const changePage = (val) => {
  pagination.page = val;
  fetchUsers();
};
</script>
