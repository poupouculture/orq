<template>
  <div style="background: white">
    <!-- LEFT sidebar fixed | CENTER sroll | RIGHT sidebar fixed  -->
    <q-layout view="lHr LpR lFr">
      <Drawer
        ref="chatList"
        v-model="openDrawer"
        v-if="!loading"
        :chat-list="chats"
        @set-chat-id="setChatID"
        @show-customer-dialog="setShowCustomerDialog"
      />
      <q-page-container>
        <CustomerDialog
          v-model="showCustomerDialog"
          @hide="showCustomerDialog = false"
          @submit="chooseCustomer"
        />
        <q-page padding>
          <router-view />
        </q-page>
      </q-page-container>
      <ChatMessages
        @new-chat-created="changeTab"
        :current-chat-id="chatID"
        @close-chat="openDrawer = true"
      />
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import useMessagingStore from "src/stores/modules/messaging";
import useCustomerStore from "src/stores/modules/customer";
import { ChatTypes } from "src/constants/ChatKeyword";
import { ICustomer } from "src/types/CustomerTypes";
import { startNewChat } from "src/api/messaging";
import Drawer from "src/components/Messaging/ChatList.vue";
import ChatMessages from "src/components/Messaging/ChatMessages.vue";
import CustomerDialog from "src/components/Messaging/CustomerDialog.vue";
import Swal from "sweetalert2";

const messagingStore = useMessagingStore();

const customerStore = useCustomerStore();
const { getCustomer } = storeToRefs(customerStore);

const chatList = ref();
const chatID = ref("");
const loading: Ref<boolean> = ref(true);
const openDrawer: Ref<boolean> = ref(true);
const showCustomerDialog: Ref<boolean> = ref(false);

onMounted(async () => {
  await fetchChats();
  loading.value = false;
});

const chats = computed(() => messagingStore.getChats);

const fetchChats = async () => {
  messagingStore.fetchChats();
};

const changeTab = (val: ChatTypes) => {
  chatList.value.onChangeTab(val);
};

const setChatID = (val: string) => {
  chatID.value = val;
};

const setShowCustomerDialog = (val: boolean) => {
  showCustomerDialog.value = val;
};

const chooseCustomer = async (user: ICustomer) => {
  try {
    const customerId = user.id;

    chatList.value.selectChatByCustomer(user.id);
    await customerStore.fetchCustomer(customerId);
    messagingStore.setCustomerName(`${user.first_name} ${user.last_name}`);
    const contactNumber = getCustomer.value.contacts[0].contacts_id.number;
    messagingStore.setContactNumber(contactNumber);

    await startNewChat(customerId, "Hi");
  } catch (e) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
    console.log(e);
  }
};
</script>
<style scoped lang="scss">
:deep(.q-page-container) {
  @media screen and (max-width: 1024px) {
    padding-right: 0px !important;
  }
}
</style>
