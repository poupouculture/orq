<template>
  <div class="hidden lg:!block">
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
import { getChatUsers } from "src/api/user";
import SearchCustomer from "src/components/Messaging/SearchCustomer.vue";
import CustomerInformationTabs from "src/components/Messaging/CustomerInformationTabs.vue";
import useUserInfoStore from "src/stores/modules/userInfo";
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
