<script setup>
import { Loading } from "quasar";
import useCustomerStore from "src/stores/modules/customer";
import useInternalGroup from "src/stores/modules/internalGroup";
import { ref, computed } from "vue";
// import BaseLayout from "../Customer/BaseLayout.vue";
import DeleteDialog from "../Dialogs/DeleteDialog.vue";

const customerStore = useCustomerStore();
const internalGroupStore = useInternalGroup();

// Props
const props = defineProps({
  id: [String, Number],
  userId: [String, Number],
  pagination: Object,
  role: String,
});

// Ref
const showUserDetail = ref(false);
const deleteDialog = ref(false);

// Computed
const user = computed(() => customerStore.user);
const pagination = computed(() => props.pagination);
const userRole = computed(() => props.role);

// Methods
const openUserDetail = async () => {
  Loading.show();
  await customerStore.fetchUser(props.userId);
  Loading.hide();
  showUserDetail.value = true;
};

const submitDelete = async () => {
  await internalGroupStore.deleteUser({
    id: props.id,
    userId: props.userId,
  });

  await internalGroupStore.getAll({
    rowsPerPage: pagination.value.rowsPerPage,
    page: pagination.value.page,
  });
};
</script>

<template>
  <q-btn color="grey-7" round flat icon="more_vert">
    <q-menu fit anchor="bottom middle" self="top right" auto-close>
      <q-list>
        <q-item clickable @click="openUserDetail()">
          <q-item-section>View</q-item-section>
        </q-item>
        <q-item clickable @click="deleteDialog = true">
          <q-item-section>Remove</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <DeleteDialog
      v-model="deleteDialog"
      @cancel="deleteDialog = false"
      @submitDelete="submitDelete"
    />
  </q-btn>

  <!-- Modal / Dialog Customer detail -->
  <q-dialog v-model="showUserDetail">
    <q-card class="w-5/12">
      <q-card-actions align="right">
        <q-btn flat round icon="close" v-close-popup />
      </q-card-actions>

      <q-card-section class="q-pt-none">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div class="col-span-2 lg:col-span-1">
            <p class="mb-2">First Name</p>
            <q-input dense outlined disable v-model="user.first_name" />
          </div>

          <div class="col-span-2 lg:col-span-1">
            <p class="mb-2">Last Name</p>
            <q-input dense outlined disable v-model="user.last_name" />
          </div>

          <div class="col-span-2 lg:col-span-1">
            <p class="mb-2">Email</p>
            <q-input dense outlined disable v-model="user.email" />
          </div>

          <div class="col-span-2 lg:col-span-1">
            <p class="mb-2">Status</p>
            <q-input dense outlined disable v-model="user.status" />
          </div>

          <div v-if="userRole" class="col-span-2 lg:col-span-1">
            <p class="mb-2">Role</p>
            <q-input dense outlined disable v-model="userRole" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.date {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    bottom: 0;
    height: 1px;
    background-color: #e6e6ec;
    @apply left-0 lg:left-4 w-[30%] md:w-[38%];
  }
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    bottom: 0;
    height: 1px;
    background-color: #e6e6ec;
    @apply right-0 lg:right-4 w-[30%] md:w-[38%];
  }
}
.q-dialog__inner--minimized > div {
  max-width: 100vw;
}
</style>
