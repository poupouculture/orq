<template>
  <div class="hidden lg:!block">
    <div
      v-if="getSelectedChatIndex !== null"
      class="row justify-end q-gutter-sm"
    >
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
                    <img src="../../assets/images/profileavatar.png" />
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
      <q-tabs
        v-model="customerInformationTab"
        dense
        class="text-grey q-mt-md"
        align="left"
        active-color="primary"
        indicator-color="primary"
        narrow-indicator
        no-caps
        inset
      >
        <q-tab name="general" label="General Information" />
        <q-tab name="other" label="Other Information" />
      </q-tabs>
      <q-separator size="2px" style="margin-top: -2px" />
      <GeneralInformation
        :mode="isContactNumberExist ? '' : 'show'"
        :show-active="false"
        :show-return-button="false"
        :show-delete-button="false"
        @submit="saveCustomer"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import useCustomerStore from "src/stores/modules/customer";
import useMessagingStore from "src/stores/modules/messaging";
import GeneralInformation from "src/components/Customer/GeneralInformation/index.vue";
import { FormPayload } from "src/types/CustomerTypes";
import { getChatUsers, assignUser as assignUserHelper } from "src/api/user";
import { closeChat } from "src/api/messaging";
import SearchCustomer from "src/components/Messaging/SearchCustomer.vue";
import useUserInfoStore from "src/stores/modules/userInfo";

const enum Tabs {
  CUSTOMER = "customer",
  SERVICE_DETAIL = "serviceDetail",
  SERVICE_RECORD = "serviceRecord",
}
const enum CustomerInformationTabs {
  GENERAL = "general",
  OTHER = "other",
}
const enum Role {
  CS = "CS",
  CS_MANAGER = "CS-Manager",
}
interface Manager {
  user_id: string;
  first_name: string;
  last_name: string;
  role_name: string;
}

const customerStore = useCustomerStore();
const messagingStore = useMessagingStore();
const isContactNumberExist = computed(
  () => messagingStore.isContactNumberExist
);
const userInfo = useUserInfoStore();
const userRole: Ref<string> = ref("");
const tab: Ref<Tabs> = ref(Tabs.CUSTOMER);
const customerInformationTab: Ref<CustomerInformationTabs> = ref(
  CustomerInformationTabs.GENERAL
);
const inputGroup: Ref<string> = ref("");
const toggle: Ref<boolean> = ref(false);
const newCustomer: Ref<boolean> = ref(false);
const managers: Ref<Array<Manager>> = ref([]);
const { getChats, getSelectedChatIndex } = storeToRefs(messagingStore);

onMounted(async () => {
  const { data } = await getChatUsers();
  // const csManager = data.filter(
  //   // (item: Manager) => item.role_name === Role.CS_MANAGER
  // );
  managers.value = data;
  userRole.value = userInfo.getUserRoleName;
});

const saveCustomer = async (val: FormPayload) => {
  if (customerStore.getCustomer.id) {
    // update
    customerStore.updateCustomer(customerStore.getCustomer.id, val);
  } else {
    // insert
    const selectedChat = getChats.value[getSelectedChatIndex.value];
    const contactId = selectedChat.contacts_id;
    const customer = await customerStore.addCustomer(val);
    customerStore.addCustomerContact(customer.id, contactId);
  }

  messagingStore.fetchChats(messagingStore.getSelectedTab);
};

const assignUser = (manager: Manager) => {
  const chatId = getChats.value[getSelectedChatIndex.value].id;
  const userId = manager.user_id;

  assignUserHelper(chatId, userId);
};

const closeConversation = async () => {
  const chatId = getChats.value[getSelectedChatIndex.value].id;
  await closeChat(chatId);
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
