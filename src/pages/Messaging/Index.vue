<template>
  <div class="hidden lg:!block">
    <div v-if="getSelectedChat.id" class="row justify-end q-gutter-sm">
      <q-btn
        outline
        color="primary"
        label="Reassign"
        icon-right="expand_more"
        no-caps
        v-if="userRole === Role.CS_MANAGER"
      >
        <q-menu
          class="q-ma-lg"
          anchor="bottom left"
          self="top left"
          :offset="[0, 5]"
          style="width: 300px"
          fit
        >
          <q-list separator>
            <q-item
              v-for="(manager, index) in managers"
              :key="index"
              clickable
              v-close-popup
              @click="assignUser(manager)"
            >
              <q-item-section>
                <div class="row items-center">
                  <q-avatar size="md">
                    <!-- <img src="../../assets/images/profileavatar.png" /> -->
                  </q-avatar>
                  <div class="q-ml-md">
                    <div class="text-weight-bold">
                      {{ manager.first_name }} {{ manager.last_name }}
                    </div>
                    <div class="text-weight-light">
                      {{ manager.role_name }}
                    </div>
                  </div>
                </div>
              </q-item-section>
              <q-separator />
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn
        :loading="closeConversationLoading"
        v-if="userRole === Role.CS_MANAGER"
        color="primary"
        label="Close Conversation"
        no-caps
        @click="closeConversation"
      />
    </div>
    <div>
      <!-- Search Customer -->
      <SearchCustomer />
      <div v-if="newCustomer">
        <div class="text-weight-medium">New Contact</div>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey q-mt-md"
          align="left"
          active-color="primary"
          indicator-color="primary"
          narrow-indicator
          no-caps
          inset
        >
          <q-tab name="customer" label="Customer" />
          <q-tab name="serviceDetail" label="Service Detail" />
          <q-tab name="serviceRecord" label="Service Record" />
        </q-tabs>
        <q-separator size="2px" style="margin-top: -2px" />
        <q-card class="q-py-md q-px-lg q-mt-md bg-grey-2" flat>
          User Group
          <q-card class="bg-white q-mt-sm row" flat>
            <q-btn label="Name" class="row text-grey-8" unelevated no-caps>
              <img
                src="../../assets/images/dropdown.png"
                class="dropdown-img"
              />
              <q-menu class="q-ma-lg" style="width: 400px">
                <div class="column"></div>
              </q-menu>
            </q-btn>
            <q-separator spaced vertical inset />
            <q-input
              v-model="inputGroup"
              class="col-8"
              placeholder="Public Group - Only Managers"
              dense
              borderless
            />
            <q-btn class="row no-hover-btn" unelevated no-caps>
              <img src="../../assets/images/dropdown.png" />
            </q-btn>
            <q-separator spaced vertical inset />
            <q-toggle v-model="toggle" color="primary" />
          </q-card>
        </q-card>
      </div>
      <!-- Customer Information Tabs -->
      <CustomerInformationTabs />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import useMessagingStore from "src/stores/modules/messaging";
import { getChatUsers, assignUser as assignUserHelper } from "src/api/user";
import { closeChat } from "src/api/messaging";
import SearchCustomer from "src/components/Messaging/SearchCustomer.vue";
import CustomerInformationTabs from "src/components/Messaging/CustomerInformationTabs.vue";
import useUserInfoStore from "src/stores/modules/userInfo";
import { Loading, Notify } from "quasar";
import {
  db,
  collection,
  onSnapshot,
  auth,
  signInWithCustomToken,
} from "src/boot/firebase";
import { ChatGroup, IChat } from "src/types/MessagingTypes";

const enum Tabs {
  CUSTOMER = "customer",
  SERVICE_DETAIL = "serviceDetail",
  SERVICE_RECORD = "serviceRecord",
}

const enum Role {
  CS = "CS",
  CS_MANAGER = "CS-Manager",
}

// const enum ChangeDocType {
//   ADDED = "added",
//   REMOVED = "removed",
//   MODIFIED = "modified",
// }

interface Manager {
  user_id: string;
  first_name: string;
  last_name: string;
  role_name: string;
}

const messagingStore = useMessagingStore();
const userInfoStore = useUserInfoStore();

const userInfo = useUserInfoStore();
const userRole: Ref<string> = ref("");
const tab: Ref<Tabs> = ref(Tabs.CUSTOMER);

const inputGroup: Ref<string> = ref("");
const toggle: Ref<boolean> = ref(false);
const newCustomer: Ref<boolean> = ref(false);
const managers: Ref<Array<Manager>> = ref([]);
const firebaseToken: Ref<string> = ref("");
const first = ref(false);

const { getChats, getSelectedChat } = storeToRefs(messagingStore);
const { getFirebaseToken } = storeToRefs(userInfoStore);

onMounted(async () => {
  const { data } = await getChatUsers();
  managers.value = data;
  userRole.value = userInfo.getUserRoleName;
  firebaseToken.value = getFirebaseToken.value;
  snapshotByChats();
});

const snapshotByChats = async () => {
  const loggedInUser = await signInWithCustomToken(auth, firebaseToken.value);
  if (loggedInUser) {
    onSnapshot(collection(db, "chats"), async (querySnapshot: any) => {
      for await (const change of querySnapshot.docChanges()) {
        if (first.value) {
          const { status } = change.doc.data();
          // delete from old chats
          messagingStore.removeChatById(change.doc.id);
          if (change.doc.id === getSelectedChat.value.id) {
            messagingStore.setSelectedChatByStatus(status);
          }
          // messagingStore.setSelectedChatIndex(-1);
          messagingStore.setChatsByStatus(status);
        }
      }
      first.value = true;
    });
  }
};

watchEffect(() => {
  getChats.value.forEach((item: ChatGroup) => {
    item.chats.forEach((chat: IChat) => {
      // add snapshot for every chat
      messagingStore.onSnapshotMessage(chat.id);
    });
  });
});

const assignUser = async (manager: Manager) => {
  const chatId = getSelectedChat.value.id;
  const userId = manager.user_id;
  try {
    Loading.show();
    await assignUserHelper(chatId, userId);
    Notify.create({
      message: `Successful assigned to ${manager.first_name} ${manager.last_name}`,
      position: "top",
      type: "positive",
      color: "blue-9",
    });
    Loading.hide();
  } catch (err: any) {
    Notify.create({
      message: err.response.data.message,
      position: "top",
      type: "negative",
    });
    Loading.hide();
  }
};

const closeConversationLoading = ref(false);
const closeConversation = async () => {
  const chatId = getSelectedChat.value.id;
  try {
    closeConversationLoading.value = true;
    await closeChat(chatId);
    Notify.create({
      message: "Conversation closed",
      type: "positive",
      position: "top",
      color: "primary",
    });
    closeConversationLoading.value = false;
  } catch (error: any) {
    closeConversationLoading.value = false;
    // if the status: invalid chat id (no associated member)
    // It means chat is not available / deleted
    Notify.create({
      message: error.response.data,
      type: "negative",
      position: "top",
    });
  }
};
</script>

<style scoped>
.dropdown-img {
  margin-left: 10px;
  width: 10px;
  height: 6.5px;
  cursor: pointer;
}

.no-hover-btn:active,
.no-hover-btn:focus,
.no-hover-btn:hover {
  background-color: transparent !important;
  color: transparent;
}
</style>
