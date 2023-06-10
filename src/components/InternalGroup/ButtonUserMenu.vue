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
  <!-- <q-dialog v-model="showUserDetail">
    <div
      class="h-full bg-white w-auto !rounded-2xl px-7 py-4 overflow-y-auto relative"
    >
      <div class="cursor-pointer absolute top-6 right-7">
        <svg
          @click="showUserDetail = false"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 13L13 1M1 1L13 13"
            stroke="#9CA3AF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <BaseLayout mode="show" />
    </div>
  </q-dialog> -->
  <!-- <q-dialog v-model="showUserDetail">
    <div
      class="h-full bg-white w-auto !rounded-2xl px-7 py-4 overflow-y-auto relative"
    >
      <div class="cursor-pointer absolute top-6 right-7">
        <svg
          @click="showUserDetail = false"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 13L13 1M1 1L13 13"
            stroke="#9CA3AF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="mt-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <p class="mb-2">Firstname</p>
            <q-input
              class="lg:w-full"
              v-model="user.first_name"
              outlined
              lazy-rules
              disable
              dense
            />
          </div>
          <div>
            <p class="mb-2">Lastname</p>
            <q-input
              class="lg:w-full"
              v-model="user.last_name"
              outlined
              lazy-rules
              disable
              dense
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <p class="mb-2">Email</p>
            <q-input
              class="lg:w-full"
              v-model="user.email"
              outlined
              lazy-rules
              disable
              dense
            />
          </div>
          <div>
            <p class="mb-2">Status</p>
            <q-input
              class="lg:w-full"
              v-model="user.status"
              outlined
              lazy-rules
              disable
              dense
            />
          </div>
        </div>
      </div>
    </div>
  </q-dialog> -->

  <q-dialog v-model="showUserDetail">
    <q-card class="w-5/12">
      <q-card-section>
        <div class="text-h6">Alert</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        aaa {{ props.userData }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { Loading } from "quasar";
import useInternalGroup from "src/stores/modules/internalGroup";
import { ref, computed } from "vue";
// import BaseLayout from "../Customer/BaseLayout.vue";
import DeleteDialog from "../Dialogs/DeleteDialog.vue";
const props = defineProps({
  id: [String, Number],
  userId: [String, Number],
  pagination: Object,
  userData: Object,
});

// const customerStore = useCustomerStore();
// const user = computed(() => customerStore.user);

const internalGroupStore = useInternalGroup();
const showUserDetail = ref(false);
const deleteDialog = ref(false);

const pagination = computed(() => props.pagination);

// Methods
const openUserDetail = async () => {
  Loading.show();
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
